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