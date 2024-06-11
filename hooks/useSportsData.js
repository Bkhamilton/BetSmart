import { useState, useEffect } from 'react';
import { retrieveGamesDate } from '@/api/prop-odds/games.js';

export function useSportsData(db, leagues, date) {
  const [sportsData, setSportsData] = useState([]);

  useEffect(() => {
    const fetchSportsData = async () => {
      const data = await retrieveGamesDate(db, leagues, date);
      setSportsData(data);
    };

    fetchSportsData();
  }, [db, leagues, date]);

  return sportsData;
}