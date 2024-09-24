export const myBetList = [
    {
      id: 1,
      type: 'parlay',
      date: '4/4/24',
      odds: '+543',
      betAmount: 20.00,
      winnings: 108.60,
      bets: [
        {
          date: '4/4/24',
          sport: 'NBA',
          home: 'LAL',
          away: 'DEN',
          odds: '+168',
          legs: [
            {
              type: 'Player Points',
              betTarget: 'Lebron James',
              stat: 'Points',
              alt: true,
              line: 20,
              overUnder: 'over'
            },
            {
              type: 'Player Assists',
              betTarget: 'Lebron James',
              stat: 'Assists',
              alt: false,
              line: 5.5,
              overUnder: 'over'
            },
            {
              type: 'Player Rebounds',
              betTarget: 'Nikola Jokic',
              stat: 'Points',
              alt: false,
              line: 26.5,
              overUnder: 'over'
            }   
          ]
        },
        {
          date: '4/4/24',
          sport: 'NBA',
          home: 'HOU',
          away: 'PHX',
          odds: '+140',
          legs: [
            {
              type: 'Player Points',
              betTarget: 'Alperen Sengun',
              stat: 'Points',
              alt: true,
              line: 18,
              overUnder: 'over'
            },
            {
              type: 'Player Assists',
              betTarget: 'Alperen Sengun',
              stat: 'Assists',
              alt: false,
              line: 3.5,
              overUnder: 'over'
            },
            {
              type: 'Player Threes',
              betTarget: 'Fred VanVleet',
              stat: 'Threes',
              alt: true,
              line: 2,
              overUnder: 'over'
            }   
          ]
        }, 
      ]
    },
    {
      id: 2,
      type: 'parlay',
      date: '4/4/24',
      odds: '+120',
      betAmount: 20.00,
      winnings: 44.00,
      bets: [
        {
          date: '4/4/24',
          sport: 'NBA',
          home: 'BOS',
          away: 'MIA',
          odds: '+120',
          legs: [
            {
              type: 'Player Points',
              betTarget: 'Jayson Tatum',
              stat: 'Points',
              alt: true,
              line: 25,
              overUnder: 'over'
            },
            {
              type: 'Player Rebounds',
              betTarget: 'Jayson Tatum',
              stat: 'Rebounds',
              alt: false,
              line: 7.5,
              overUnder: 'over'
            },
            {
              type: 'Player Assists',
              betTarget: 'Bam Adebayo',
              stat: 'Assists',
              alt: false,
              line: 5.5,
              overUnder: 'over'
            }   
          ]
        }, 
      ]
    }
  ];

export const playoffBets = [
  {
    id: 1,
    type: 'parlay',
    date: '4/4/24',
    odds: '+130',
    betAmount: 50.00,
    winnings: 65.23,
    bets: [
      {
        date: '4/4/24',
        sport: 'NBA',
        home: 'BOS',
        away: 'MIA',
        odds: '+130',
        legs: [
          {
            type: 'Player Points',
            betTarget: 'Jaylen Brown',
            stat: 'Points',
            line: 20.0,
            overUnder: 'over'
          },
          {
            type: 'Player Threes',
            betTarget: 'Jrue Holiday',
            stat: 'Threes',
            line: 1.5,
            overUnder: 'over'
          },  
        ]
      },
    ]
  },
  {
    id: 2,
    type: 'live',
    date: '5/1/24',
    odds: '+154',
    betAmount: 2.00,
    winnings: 5.08,
    bets: [
      {
        date: '4/4/24',
        sport: 'NBA',
        home: 'BOS',
        away: 'MIA',
        odds: '+154',
        legs: [
          {
            type: 'Player Threes',
            betTarget: 'Jrue Holiday',
            stat: 'Threes',
            line: 1.5,
            overUnder: 'under'
          }, 
        ]
      }, 
    ]
  },
  {
    id: 3,
    type: 'parlay',
    date: '5/1/24',
    odds: '+1700',
    betAmount: 1.00,
    winnings: 18.00,
    bets: [
      {
        date: '5/1/24',
        sport: 'NBA',
        home: 'DAL',
        away: 'LAC',
        odds: '+1700',
        legs: [
          {
            type: 'Main',
            betTarget: 'DAL',
            stat: 'Spread',
            line: 3,
            overUnder: 'over'
          },
          {
            type: 'Player Points',
            betTarget: 'Luka Doncic',
            stat: 'Points',
            line: 40,
            overUnder: 'over'
          },
          {
            type: 'Player Threes',
            betTarget: 'Norman Powell',
            stat: 'Threes',
            line: 3,
            overUnder: 'over'
          }
        ]
      }
    ]
  },
  {
    id: 4,
    type: 'parlay',
    date: '5/1/24',
    odds: '+281',
    betAmount: 10.00,
    winnings: 38.10,
    bets: [
      {
        date: '5/1/24',
        sport: 'NBA',
        home: 'BOS',
        away: 'MIA',
        odds: '+281',
        legs: [
          {
            type: 'Player Points',
            betTarget: 'Jayson Tatum',
            stat: 'Points',
            line: 25.0,
            overUnder: 'over'
          },
          {
            type: 'Player Threes',
            betTarget: 'Jayson Tatum',
            stat: 'Threes',
            line: 3,
            overUnder: 'over'
          },
          {
            type: 'Player Assists',
            betTarget: 'Jaylen Brown',
            stat: 'Assists',
            line: 2.5,
            overUnder: 'over'
          }  
        ]
      }
    ]
  },
  {
    id: 5,
    type: 'parlay',
    date: '5/1/24',
    odds: '+634',
    betAmount: 4.00,
    winnings: 30.36,
    bets: [
      {
        date: '5/1/24',
        sport: 'NBA',
        home: 'DEN',
        away: 'MIN',
        odds: '+634',
        legs: [
          {
            type: 'Player Points',
            betTarget: 'Anthony Edwards',
            stat: 'Points',
            line: 30.0,
            overUnder: 'over'
          },
          {
            type: 'Player Rebounds',
            betTarget: 'Rudy Gobert',
            stat: 'Rebounds',
            line: 10.0,
            overUnder: 'over'
          },
          {
            type: 'Player Threes',
            betTarget: 'Jamal Murray',
            stat: 'Threes',
            line: 2,
            overUnder: 'over'
          },
          {
            type: 'Player Points',
            betTarget: 'Nikola Jokic',
            stat: 'Points',
            line: 30.0,
            overUnder: 'over'
          }  
        ]
      }
    ]
  },
  {
    id: 6,
    type: 'parlay plus',
    date: '5/1/24',
    odds: '+129550',
    betAmount: 1.00,
    winnings: 1296.50,
    bets: [
      {
        date: '5/1/24',
        sport: 'NBA',
        home: 'ORL',
        away: 'CLE',
        odds: '+3628',
        legs: [
          {
            type: 'Player Threes',
            betTarget: 'Jalen Suggs',
            stat: 'Threes',
            line: 4,
            overUnder: 'over'
          },
          {
            type: 'Player Points',
            betTarget: 'Jalen Suggs',
            stat: 'Points',
            line: 20.0,
            overUnder: 'over'
          },
          {
            type: 'Player Rebounds',
            betTarget: 'Paolo Banchero',
            stat: 'Rebounds',
            line: 7.5,
            overUnder: 'over'
          },
          {
            type: 'Player Assists',
            betTarget: 'Paolo Banchero',
            stat: 'Assists',
            line: 6,
            overUnder: 'over'
          }  
        ]
      },
      {
        date: '5/1/24',
        sport: 'NBA',
        home: 'DAL',
        away: 'LAC',
        odds: '+3377',
        legs: [
          {
            type: 'Player Threes',
            betTarget: 'Kyrie Irving',
            stat: 'threes',
            line: 4,
            overUnder: 'over'
          },
          {
            type: 'Player Points',
            betTarget: 'Ivica Zubac',
            stat: 'Points',
            line: 17.5,
            overUnder: 'over'
          },
          {
            type: 'Player Points',
            betTarget: 'Kyrie Irving',
            stat: 'Points',
            line: 30.0,
            overUnder: 'over'
          },
          {
            type: 'Player Points',
            betTarget: 'James Harden',
            stat: 'Points',
            line: 16.5,
            overUnder: 'under'
          }
        ]
      }
    ]
  },
  {
    id: 7,
    type: 'parlay',
    date: '5/1/24',
    odds: '+475',
    betAmount: 25.00,
    winnings: 143.75,
    bets: [
      {
        date: '5/1/24',
        sport: 'NBA',
        home: 'DEN',
        away: 'MIN',
        odds: '+475',
        legs: [
          {
            type: 'Main',
            betTarget: 'DEN',
            stat: 'Moneyline',
          },
          {
            type: 'Player Points',
            betTarget: 'Nikola Jokic',
            stat: 'Points',
            line: 30.0,
            overUnder: 'over'
          },
          {
            type: 'Player Rebounds',
            betTarget: 'Rudy Gobert',
            stat: 'Rebounds',
            line: 12.5,
            overUnder: 'over'
          }
        ]
      }
    ]
  }
];

export const betSlipsRaw = [{
  id: 1,
  betAmount: 20,
  betWon: 40,
  betStatus: 'won'
},
{
  id: 2,
  betAmount: 30,
  betWon: 0,
  betStatus: 'lost'
},
{
  id: 3,
  betAmount: 10,
  betWon: 20,
  betStatus: 'won'
},
{
  id: 4,
  betAmount: 40,
  betWon: 0,
  betStatus: 'lost'
},
{
  id: 5,
  betAmount: 20,
  betWon: 40,
  betStatus: 'won'
},
{
  id: 6,
  betAmount: 30,
  betWon: 0,
  betStatus: 'lost'
},
{
  id: 7,
  betAmount: 10,
  betWon: 20,
  betStatus: 'won'
},
{
  id: 8,
  betAmount: 40,
  betWon: 0,
  betStatus: 'lost'
}]