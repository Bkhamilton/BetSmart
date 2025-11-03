// Type definitions for BetSmart application
// This file contains all the TypeScript types used across the application
// Reference: Context files (UserContext.tsx, BetContext.tsx, DBContext.tsx, SupabaseContext.tsx)
// Reference: Database schema documentation (docs/DatabaseSchema.md)

// ==================== User Related Types ====================

export interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    password: string;
}

export interface Balance {
    id: number;
    userId: number;
    bookieId: number;
    balance: number;
    bookieName: string;
}

export interface Preference {
    bankroll: number;
    dailyLimit: number;
    unitSize: string;
    preferredLeagues: string[];
    preferredBetTypes: string[];
    riskTolerance: number;
    oddsFormat: string;
}

export interface DBPreference {
    id: number;
    userId: number;
    bankroll: number;
    dailyLimit: number;
    unitSize: string;
    preferredLeagues: string;
    preferredBetTypes: string;
    riskTolerance: number;
    oddsFormat: string;
}

export interface LocationStatus {
    verified: boolean;
    isLegal: boolean | null;
    state: string | null | undefined;
    lastChecked: string | null | undefined;
    error: string | null;
}

// ==================== Bookie Related Types ====================

export interface Bookie {
    id: number;
    name: string;
    description?: string;
    website?: string;
}

export interface Bonus {
    id: number;
    bookieId: number;
    userId: number;
    bonusType: string;
    bonusAmount: number;
    timestamp: string;
    description: string;
}

// ==================== League and Sports Related Types ====================

export interface League {
    id: number;
    leagueName: string;
    sport: string;
    description: string;
}

export interface Season {
    id: number;
    leagueId: number;
    season: string;
    games: number;
    description: string;
    seasonType: string;
    startDate: string;
    endDate: string;
}

export interface LeagueProp {
    id: number;
    leagueId: number;
    propName: string;
}

export interface LeaguePropInfo {
    id: number;
    leaguePropId: number;
    propValue: string;
}

// ==================== Team and Player Related Types ====================

export interface Team {
    id: number;
    teamName: string;
    abbreviation: string;
    leagueId: number;
    logoUrl?: string;
}

export interface Player {
    id: number;
    name: string;
    position: string;
    number: string;
    image: string;
    teamId: number;
}

// ==================== Game Related Types ====================

export interface Game {
    id: number;
    gameId: string;
    seasonId?: number;
    date: string;
    timestamp: string;
    homeTeamId?: number;
    homeTeamName: string;
    homeTeamAbv: string;
    awayTeamId?: number;
    awayTeamName: string;
    awayTeamAbv: string;
}

export interface GameResult {
    id: number;
    gameId: string;
    homeScore: number;
    awayScore: number;
    winner: number;
}

// ==================== Betting Related Types ====================

export interface BetSlip {
    id: number;
    formatId?: number;
    type: string;
    date: Date;
    odds: number;
    betAmount: number;
    winnings: number;
    bets: Bet[];
    userId?: number;
    bookieId: number;
}

export interface DBBetSlip {
    id: number;
    formatId: number;
    formatName?: string;
    date: string;
    odds: string;
    betAmount: number;
    winnings: number;
    userId: number;
    bookieId: number;
    bookieName?: string;
    result?: string;
}

export interface BetSlipResult {
    id: number;
    betSlipId: number;
    result: string;
}

export interface Bet {
    date: string;
    league: string;
    gameId: string;
    home: string;
    away: string;
    odds: number;
    legs: Leg[];
}

export interface ParticipantBet {
    id: number;
    betSlipId: number;
    gameId: string;
    odds: number;
}

export interface ParticipantBetWithLegs extends ParticipantBet {
    legs: Leg[];
}

export interface DBBetSlipWithBets extends DBBetSlip {
    bets: ParticipantBetWithLegs[];
}

export interface ParticipantBetResult {
    id: number;
    participantBetId: number;
    result: string;
}

export interface Leg {
    type: string;
    betTarget: string;
    stat: string;
    line: string;
    overUnder: string;
    odds: string;
}

export interface DBLeg {
    id: number;
    participantBetId: number;
    betMarketId: number;
    betTypeId: number;
}

export interface LegResult {
    id: number;
    legId: number;
    result: string;
}

export interface BetMarket {
    id: number;
    gameId: string;
    marketType: string;
    timestamp: string;
    value: string;
    odds: string;
    overUnder: string;
    betTargetId: number;
    bookieId: number;
}

export interface BetTarget {
    id: number;
    targetName: string;
}

export interface BetType {
    id: number;
    betType: string;
    description: string;
}

export interface BetFormat {
    id: number;
    formatName: string;
    description: string;
}

// ==================== Transaction Related Types ====================

export interface Transaction {
    id: number;
    userId: number;
    bookieId: number;
    amount: number;
    transactionType: string;
    timestamp: string;
    bookieName?: string;
    description?: string;
}

// ==================== Data Fetching Related Types ====================

export interface FetchHistory {
    id: number;
    league: string;
    lastFetched: string;
}

export interface MarketFetchHistory {
    id: number;
    gameId: string;
    marketType: string;
    lastFetched: string;
}

// ==================== Navigation and Screen Props ====================

export interface ScreenProps {
    navigation?: any;
    route?: any;
}

// ==================== Modal Related Types ====================

export interface ModalProps {
    visible: boolean;
    close: () => void;
}

// ==================== Hook Return Types ====================

export interface UseHookHomeReturn {
    confirmModalVisible: boolean;
    chooseBookieModalVisible: boolean;
    profileOptionsModalVisible: boolean;
    confirmedBetSlip: DBBetSlip | null;
    betSlips: DBBetSlip[];
    weeklyBets: DBBetSlip[];
    refreshing: boolean;
    onRefresh: () => void;
    openChooseBookieModal: () => void;
    closeChooseBookieModal: () => void;
    openConfirmModal: () => void;
    closeConfirmModal: () => void;
    openProfileOptionsModal: () => void;
    closeProfileOptionsModal: () => void;
    onConfirmBetSlip: (betSlip: BetSlip) => void;
}

export interface UseConfirmationStateReturn {
    confirmationModalVisible: boolean;
    closeConfirmationModal: () => void;
    confirmMessage: string;
    onHandleConfirm: () => void;
    handleConfirmation: (message: string, onClose: () => void, onConfirm: (...args: any[]) => void, args: any[]) => void;
}

export interface UseUserBalDataStateReturn {
    addBookieModalVisible: boolean;
    transactionModalVisible: boolean;
    transactionTitle: string;
    transactionBookie: Bookie | null;
    userTransactions: Transaction[];
    openAddBookieModal: () => void;
    closeAddBookieModal: () => void;
    openTransactionModal: (title: string, bookie: Bookie) => void;
    closeTransactionModal: () => void;
    addBookie: (bookie: Bookie) => void;
    onConfirmTransaction: (type: string, amount: number) => void;
}

export interface UseOptionsStateReturn {
    optionsModalVisible: boolean;
    closeOptionsModal: () => void;
    options: string[];
    onHandleOption: (option: string) => void;
    handleOpenOptions: (options: string[], onSelect: (option: string) => void) => void;
}

// ==================== Insights and Analytics Types ====================

export interface BettingPerformanceData {
    totalBets: number;
    winRate: number;
    roi: number;
    profit: number;
    avgOdds: number;
}

export interface AnalyticsData {
    period: string;
    performance: BettingPerformanceData;
    byLeague?: Record<string, BettingPerformanceData>;
    byBetType?: Record<string, BettingPerformanceData>;
    byBookie?: Record<string, BettingPerformanceData>;
}

// ==================== Component Props Types ====================

export interface GameListProps {
    games: Game[];
    onGameSelect?: (game: Game) => void;
}

export interface BetSlipListProps {
    betSlips: DBBetSlip[];
}

export interface TransactionListProps {
    transactions: Transaction[];
}

export interface HeaderProps {
    title?: string;
    onBack?: () => void;
    rightAction?: () => void;
}

// ==================== Form Input Types ====================

export interface LoginFormData {
    username: string;
    password: string;
}

export interface SignupFormData {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export interface TransactionFormData {
    amount: number;
    type: string;
    bookieId: number;
}

export interface BetPreferencesFormData {
    bankroll: number;
    dailyLimit: number;
    unitSize: string;
    preferredLeagues: string[];
    preferredBetTypes: string[];
    riskTolerance: number;
    oddsFormat: string;
}

// ==================== API Response Types ====================

export interface SupabaseGame {
    id: number;
    gameId: string;
    date: string;
    timestamp: string;
    homeTeamName: string;
    homeTeamAbv: string;
    awayTeamName: string;
    awayTeamAbv: string;
}

export interface SupabaseBetMarket {
    id: number;
    gameId: string;
    marketType: string;
    timestamp: string;
    value: string;
    odds: string;
    overUnder: string;
    betTargetId: number;
    bookieId: number;
}

// ==================== Selection and Filter Types ====================

export interface TimeFilter {
    label: string;
    value: string;
    startDate?: string;
    endDate?: string;
}

export interface BetTypeFilter {
    label: string;
    value: string;
    selected: boolean;
}

export interface LeagueFilter {
    label: string;
    value: string;
    leagueId: number;
    selected: boolean;
}

// ==================== Sport Data Types ====================

export interface SportData {
    league: string;
    sport: string;
    data: Game[];
}

export interface AllSportsData extends Array<SportData> {}

// ==================== Context Value Types ====================

export interface UserContextValue {
    user: User | null;
    userBalance: Balance[] | null;
    setUserBalance: (userBalance: Balance[] | null) => void;
    bookie: Bookie | null;
    setBookie: (bookie: Bookie | null) => void;
    trigger: boolean;
    setTrigger: (trigger: boolean) => void;
    preferences: Preference;
    updatePreferences: (preferences: Preference) => Promise<void>;
    signedIn: boolean;
    setSignedIn: (signedIn: boolean) => void;
    locationStatus: LocationStatus;
    checkLocation: () => Promise<{
        isLegal: boolean | null;
        state?: string | null | undefined;
        coordinates?: any;
        timestamp?: string | null | undefined;
        error?: any;
    }>;
}

export interface DBContextValue {
    db: any;
    bookies: Bookie[];
    leagues: League[];
}

export interface SupabaseContextValue {
    supabase?: any;
    leagues?: League[];
}

export interface BetContextValue {
    betSlip: BetSlip | null;
    setBetSlip: (betSlip: BetSlip | null) => void;
    currentGame: Game | null;
    setCurrentGame: (game: Game | null) => void;
    league: League | null;
    setLeague: (league: League | null) => void;
    bookie: string | null;
    setBookie: (bookie: string | null) => void;
    bookieId: Number | null;
    setBookieId: (bookieId: Number | null) => void;
    selectProp: (props: { game: any; type: any; target: any; stat: any; value: any; overUnder: any; odds: any; bookieId: any; }) => void;
    totalLegs: Number | null;
    setTotalLegs: (totalLegs: number) => void;
    confirmBetSlip: (db: any) => Promise<void>;
}

export interface GameContextValue {
    currentGame: Game | null;
    setCurrentGame: (game: Game | null) => void;
}

export interface LeagueContextValue {
    league: League | null;
    setLeague: (league: League | null) => void;
}

export interface BookieSelectionContextValue {
    bookie: string | null;
    setBookie: (bookie: string | null) => void;
    bookieId: Number | null;
    setBookieId: (bookieId: Number | null) => void;
}

export interface BetSlipContextValue {
    betSlip: BetSlip | null;
    setBetSlip: (betSlip: BetSlip | null) => void;
    totalLegs: Number | null;
    setTotalLegs: (totalLegs: number) => void;
    selectProp: (props: { game: any; type: any; target: any; stat: any; value: any; overUnder: any; odds: any; bookieId: any; }) => void;
    confirmBetSlip: (db: any) => Promise<void>;
}
