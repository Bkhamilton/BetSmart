import { useState, useEffect } from 'react';
import { retrieveGames } from '@/api/prop-odds/games.js';

export function useSportsData(db, leagues) {
  const [sportsData, setSportsData] = useState([]);

  useEffect(() => {
    const fetchSportsData = async () => {
      const data = await retrieveGames(db, leagues);
      setSportsData(data);
    };

    fetchSportsData();
  }, [db, leagues]);

  return sportsData;
}