import { useState, useContext, useEffect } from 'react';
import { BetContext } from '@/contexts/BetContext/BetContext';
import { DBContext } from '@/contexts/DBContext';
import { retrieveAllGames } from '@/api/the-odds/markets';

const useHookSelectGame = () => {

    const { db } = useContext(DBContext);

    const { league, setLeague } = useContext(BetContext);

    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const [date, setDate] = useState(formattedToday);
  
    const [header, setHeader] = useState('Place Bet');

    const [selectLeagueModal, setSelectLeagueModal] = useState(false);
    const [leagueSelected, setLeagueSelected] = useState(false);

    const [allSportsData, setAllSportsData] = useState([]);

    const openSelectLeagueModal = () => {
        setSelectLeagueModal(true);
    }
    
    const closeSelectLeagueModal = () => {
        setSelectLeagueModal(false);
    }

    const updateDate = (direction) => {
        const currentDate = new Date(date); // Get the current date
    
        // Check the direction parameter
        if (direction === 'prev') {
          currentDate.setDate(currentDate.getDate()); // Set the date to the previous day
        } else if (direction === 'next') {
          currentDate.setDate(currentDate.getDate() + 2); // Set the date to the next day
        } else {
          console.log('Invalid direction parameter. Please use "prev" or "next".');
          return; // Exit the function if the direction parameter is invalid
        }
    
        // Update the date state with the new date
        setDate(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`);
    }

    const selectLeague = (newLeague) => {
        if (league?.leagueName === newLeague.leagueName) {
          setLeague({});
          setHeader('Place Bet');
          setLeagueSelected(false);
        } else {
          setLeague(newLeague);
          setHeader(newLeague.leagueName);
          setLeagueSelected(true);
        }
    }

    useEffect(() => {
        const fetchSportsData = async () => {
          retrieveAllGames(db, date).then((games) => {
            setAllSportsData(games);
          });
        };
      
        fetchSportsData();
    }, [date]);

    return {
        date,
        header,
        selectLeagueModal,
        leagueSelected,
        allSportsData,
        setSelectLeagueModal,
        openSelectLeagueModal,
        closeSelectLeagueModal,
        updateDate,
        selectLeague,
    };
};

export default useHookSelectGame;