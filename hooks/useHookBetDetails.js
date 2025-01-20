import { useState, useEffect, useContext } from 'react';
import { DBContext } from '@/contexts/DBContext';
import { getLeaguePropsForLeague } from '@/db/bet-general/LeagueProps';
import { getLeaguePropInfo } from '@/db/bet-general/LeaguePropsInfo';
import { BetContext } from '@/contexts/BetContext/BetContext';

const useHookBetDetails = () => {

    const { db } = useContext(DBContext);

    const { league } = useContext(BetContext);

    const [leagueProps, setLeagueProps] = useState([]); // [ { id: 0, leagueId: 0, propName: '' }
    const [leaguePropInfo, setLeaguePropInfo] = useState([]); // [ { id: 0, leagueId: 0, propName: '', propValue: '' }
  
    const [curLeagueProp, setCurLeagueProp] = useState('Popular');
  
    const selectLeagueProp = (prop) => {
        setCurLeagueProp(prop);
    };
  
    useEffect(() => {
        getLeaguePropsForLeague(db, league.id).then((props) => {
            const sortedProps = props.sort((a, b) => a.id - b.id);
            console.log('sortedProps:', sortedProps);
            setLeagueProps(sortedProps);
        });
    }, []);
  
    useEffect(() => {
        if (curLeagueProp) {
            getLeaguePropInfo(db, league.id, curLeagueProp).then((info) => {
                const sortedInfo = info.sort((a, b) => a.id - b.id);
                console.log('sortedInfo:', sortedInfo);
                setLeaguePropInfo(sortedInfo);
            });
        }
    }, [curLeagueProp]);

    return {
        leagueProps,
        leaguePropInfo,
        curLeagueProp,
        selectLeagueProp,
    };
};

export default useHookBetDetails;