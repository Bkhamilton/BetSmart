import { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/contexts/UserContext';
import { fillBetSlips, fillBetSlipsWithResults } from '@/contexts/NewBetContext/BetContext/betSlipHelpers';
import { getOpenBetSlips, getLastWeekOfBetSlips } from '@/db/betslips/BetSlips';
import { confirmBetResults } from '@/utils/dbHelpers';
import { DBContext } from '@/contexts/DBContext';
import { HistorySyncContext } from '@/contexts/HistorySyncContext';

const useHookHome = () => {

    const { db } = useContext(DBContext);

    const { user, trigger, setTrigger } = useContext(UserContext);
    const { revision } = useContext(HistorySyncContext);

    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [chooseBookieModalVisible, setChooseBookieModalVisible] = useState(false);
    const [profileOptionsModalVisible, setProfileOptionsModalVisible] = useState(false);

    const [confirmedBetSlip, setConfirmedBetSlip] = useState({});

    const [betSlips, setBetSlips] = useState([]);
    const [betSlipsOwner, setBetSlipsOwner] = useState(null);

    const [weeklyBets, setWeeklyBets] = useState([]);
    const [weeklyBetsOwner, setWeeklyBetsOwner] = useState(null);

    const [triggerFetch, setTriggerFetch] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        // Add your data reloading logic here
        setTriggerFetch(prev => !prev);
        setRefreshing(false);
    };

    function openChooseBookieModal() {
        setChooseBookieModalVisible(true);
    }

    function closeChooseBookieModal() {
        setChooseBookieModalVisible(false);
    }

    function openConfirmModal(betSlip) {
        setConfirmedBetSlip(betSlip);
        setConfirmModalVisible(true);
    }
    function closeConfirmModal() {
        setConfirmModalVisible(false);
    }

    function openProfileOptionsModal() {
        setProfileOptionsModalVisible(true);
    }

    function closeProfileOptionsModal() {
        setProfileOptionsModalVisible(false);
    }

    const onConfirmBetSlip = async (betSlip) => {
        try {
            await confirmBetResults(db, betSlip, user);
            closeConfirmModal();
            setTriggerFetch(prev => !prev);
            setTrigger(prev => !prev);
        } catch (error) {
            console.error('Unable to confirm bet results:', error);
        }
    };

    useEffect(() => {
        let active = true;
        const fetchData = async () => {
            try {
                if (!user || !db) {
                    setBetSlips([]);
                    setBetSlipsOwner(null);
                    return;
                }
                const betSlips = await getOpenBetSlips(db, user.id);
                const betSlipsWithBets = await fillBetSlips(db, betSlips);
                if (active) {
                    setBetSlips(betSlipsWithBets);
                    setBetSlipsOwner(user.id);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
        return () => { active = false; };
    }, [db, triggerFetch, trigger, user, revision]);

    useEffect(() => {
        let active = true;
        const fetchWeeklyBets = async () => {
            try {
                if (!user || !db) {
                    setWeeklyBets([]);
                    setWeeklyBetsOwner(null);
                    return;
                }
                const betSlips = await getLastWeekOfBetSlips(db, user.id);
                const betSlipsWithBets = await fillBetSlipsWithResults(db, betSlips);
                if (active) {
                    setWeeklyBets(betSlipsWithBets);
                    setWeeklyBetsOwner(user.id);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchWeeklyBets();
        return () => { active = false; };
    }, [db, triggerFetch, trigger, user, revision]);

    return {
        confirmModalVisible,
        chooseBookieModalVisible,
        profileOptionsModalVisible,
        confirmedBetSlip, setConfirmedBetSlip,
        betSlips: user && betSlipsOwner === user.id ? betSlips : [], setBetSlips,
        weeklyBets: user && weeklyBetsOwner === user.id ? weeklyBets : [],
        triggerFetch, setTriggerFetch,
        refreshing, setRefreshing,
        onRefresh,
        openChooseBookieModal,
        closeChooseBookieModal,
        openConfirmModal,
        closeConfirmModal,
        openProfileOptionsModal,
        closeProfileOptionsModal,
        onConfirmBetSlip,
    };
};

export default useHookHome;