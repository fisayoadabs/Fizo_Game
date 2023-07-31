const express = require('express');
const cors = require('cors');

const app = express();
const corsOptions = {
  origin: '*', // Allow requests from any origin
  methods: 'GET', // Allow only GET requests
};

app.use('/wordle/api', cors(corsOptions));

app.get('/wordle/api', (req, res) => {
  const dictionary = [
    {
        "word": "Kiwi",
        "hint": "A round fuzzy fruit"
      },
      {
        "word": "Book",
        "hint": "A written or printed work consisting of pages glued or sewn together along one side and bound in covers"
      },
      {
        "word": "Drum",
        "hint": "It's a percussion instrument"
      },
      {
        "word": "Gums",
        "hint": "the dental name for the flesh underneath your teeth"
      },
      {
        "word": "Fire",
        "hint": "Water, Earth, ... and Air"
      },
      {
        "word": "Baby",
        "hint": "Not an infant but a ...."
      },
      {
        "word": "Gain",
        "hint": "No pain no "
      },
      {
        "word": "Yoda",
        "hint": "A true master, he is"
      },
      {
        "word": "Kane",
        "hint": "England's Superstar in football"
      },
      {
        "word": "Time",
        "hint": "When you're having fun you lose track of ...."
      },
      {
        "word": "Ferb",
        "hint": "Phineas and ...."
      },
      {
        "word": "Sign",
        "hint": "In naruto to cast justus you need hand ...."
      },
      {
        "word": "Yang",
        "hint": "In balance there is yin and ...."
      },
      {
        "word": "Crow",
        "hint": "Itachi's genjutsu animal"
      },
      {
        "word": "Liar",
        "hint": "If I don't tell the truth I am a ...."
      },
      {
        "word": "Code",
        "hint": "To be a software engineer you need to learn how to ...."
      },
      {
        "word": "Siri",
        "hint": "Apple's artificial intelligence"
      },
      {
        "word": "Gold",
        "hint": "What is Au"
      },
      {
        "word": "Feud",
        "hint": "Steve Harvey's Show"
      },
      {
        "word": "Blue",
        "hint": "Color of sadness"
      },
      {
        "word": "Pill",
        "hint": "Medicine comes in the form of a ...."
      },
      {
        "word": "Clue",
        "hint": "In an escape room you need to find the .... to get out"
    },
    {
        "word": "Mode",
        "hint": "Mean Median and ...."
    },
    {
        "word": "Mean",
        "hint": "When someone is not nice"
    },
    {
        "word": "Rude",
        "hint": "When someone is being disrespectful"
    },
    {
        "word": "Monk",
        "hint": "Basketball player Malik ..."
    },
    {
        "word": "Read",
        "hint": "What did uncle rukus make tom do to cure him of stinkmeaner"
    },
    {
        "word": "Fund",
        "hint": "Yung Reesy aka the ....raiser"
    },
    {
        "word": "Jail",
        "hint": "When you are put behind bars, you are in ...."
    },
    {
        "word": "Lock",
        "hint": "Ore wa sutoraikādesu"
    },
    {
        "word": "Kise",
        "hint": "Perfect copy"
    },
    {
        "word": "Cote",
        "hint": "Daga Horikita Ore wa Omae wo Nakama dato amotte Koto wa nai Omae mo Kushida mo Hirata mo Subete no ningen wa Dogu deshikanai Kate wa kankenai Donna giseo haraoto kamawanai Kono yo wa Katsu koto ga subete da Saigo ni Ore ga Katte sai ireba Sore de ii"
    },
    {
        "word": "Zone",
        "hint": "All members of the generation of miracles can enter this state"
    },
    {
        "word": "Zero",
        "hint": "Natsuki Subaru"
    },
    {
        "word": "Peak",
        "hint": "When you are at the top of the mountain"
    },
    {
        "word": "Weak",
        "hint": "What Gojo Satoru thinks everyone is."
    },
    {
        "word": "Swim",
        "hint": "To move in water is to ...."
    },
    {
        "word": "Evil",
        "hint": "Candace song with her mom's band describe her brothers as ...."
    },
    {
        "word": "Moon",
        "hint": "I control the tides/waves"
    },
    {
        "word": "Dawn",
        "hint": "Yuno's squad"
    },
    {
        "word": "Bull",
        "hint": "Yami's squad"
    },
    {
        "word": "Bron",
        "hint": "Lakers, Heats, Cavaliers, Le.... "
    }

  ];

  res.json(dictionary);
});

app.listen(4000, () => {
  console.log('Listening on port 4000...');
});
