import { DatabaseSync } from 'node:sqlite';
import { syncSeasons } from '../sync';
import { getAllSeasons } from '../Seasons';

jest.mock('../Seasons', () => ({ getAllSeasons: jest.fn() }));

const season = {
  id: 12, leagueId: 1, season: '2026-2027', games: 82,
  description: 'NBA Season', seasonType: 'Regular Season',
  startDate: '2026-10-20', endDate: '2027-04-12',
};

let sqlite;
let db;

beforeEach(() => {
  jest.clearAllMocks();
  sqlite = new DatabaseSync(':memory:');
  sqlite.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE Leagues (id INTEGER PRIMARY KEY);
    CREATE TABLE Seasons (
      id INTEGER PRIMARY KEY, leagueId INTEGER NOT NULL REFERENCES Leagues(id),
      season TEXT NOT NULL, games INTEGER NOT NULL, description TEXT,
      seasonType TEXT NOT NULL, startDate TEXT NOT NULL, endDate TEXT NOT NULL,
      UNIQUE (leagueId, season, games, seasonType, startDate, endDate)
    );
    CREATE TABLE Games (id INTEGER PRIMARY KEY, seasonId INTEGER REFERENCES Seasons(id));
    INSERT INTO Leagues VALUES (1);
  `);
  db = {
    runAsync: async (sql, params) => sqlite.prepare(sql).run(...params),
    withTransactionAsync: async (callback) => {
      sqlite.exec('BEGIN');
      try {
        await callback();
        sqlite.exec('COMMIT');
      } catch (error) {
        sqlite.exec('ROLLBACK');
        throw error;
      }
    },
  };
});

afterEach(() => sqlite.close());

test('inserts and updates seasons without replacing existing IDs or dependent games', async () => {
  getAllSeasons.mockResolvedValue([season]);
  expect(await syncSeasons(db, {})).toBe(true);
  sqlite.exec('INSERT INTO Games VALUES (7, 12)');
  expect(await syncSeasons(db, {})).toBe(false);
  getAllSeasons.mockResolvedValue([{ ...season, endDate: '2027-04-13' }]);
  expect(await syncSeasons(db, {})).toBe(true);
  expect(sqlite.prepare('SELECT endDate FROM Seasons WHERE id = 12').get().endDate).toBe('2027-04-13');
  expect(sqlite.prepare('SELECT seasonId FROM Games WHERE id = 7').get().seasonId).toBe(12);
});

test('rolls back a failed season sync and surfaces the error', async () => {
  getAllSeasons.mockResolvedValue([season, { ...season, id: 13, leagueId: 999 }]);
  const errorLog = jest.spyOn(console, 'error').mockImplementation(() => {});
  try {
    await expect(syncSeasons(db, {})).rejects.toThrow();
    expect(sqlite.prepare('SELECT COUNT(*) AS count FROM Seasons').get().count).toBe(0);
    expect(errorLog).toHaveBeenCalled();
  } finally {
    errorLog.mockRestore();
  }
});
