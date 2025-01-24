import { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/contexts/UserContext';
import { fillBetSlips, fillBetSlipsWithResults } from '@/contexts/BetContext/betSlipHelpers';
import { getOpenBetSlips, getLastWeekOfBetSlips } from '@/db/betslips/BetSlips';
import { confirmBetResults } from '@/utils/dbHelpers';
import { DBContext } from '@/contexts/DBContext';

const useHookHome = () => {

    const { db } = useContext(DBContext);

    const { user, trigger, setTrigger } = useContext(UserContext);

    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [chooseBookieModalVisible, setChooseBookieModalVisible] = useState(false);
    const [profileOptionsModalVisible, setProfileOptionsModalVisible] = useState(false);

    const [confirmedBetSlip, setConfirmedBetSlip] = useState({});

    const [betSlips, setBetSlips] = useState([]);

    const [weeklyBets, setWeeklyBets] = useState([]);

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

    const onConfirmBetSlip = (betSlip) => {
        confirmBetResults(db, betSlip, user);

        closeConfirmModal();

        setTriggerFetch(prev => !prev);
        setTrigger(prev => !prev);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!user) return;
                const betSlips = await getOpenBetSlips(db, user.id);
                const betSlipsWithBets = await fillBetSlips(db, betSlips);
                setBetSlips(betSlipsWithBets);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, [triggerFetch, trigger, user]);

    useEffect(() => {
        const fetchWeeklyBets = async () => {
            try {
                if (!user) return;
                const betSlips = await getLastWeekOfBetSlips(db, user.id);
                const betSlipsWithBets = await fillBetSlipsWithResults(db, betSlips);
                console.log(JSON.stringify(betSlipsWithBets, null, 2));
                setWeeklyBets(betSlipsWithBets);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchWeeklyBets();
    }, [triggerFetch, trigger, user]);

    return {
        confirmModalVisible,
        chooseBookieModalVisible,
        profileOptionsModalVisible,
        confirmedBetSlip, setConfirmedBetSlip,
        betSlips, setBetSlips,
        weeklyBets,
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