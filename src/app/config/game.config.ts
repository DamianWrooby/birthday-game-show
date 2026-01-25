import { GameConfig } from './interfaces/game-config.interface';

export const GAME_CONFIG: GameConfig = {
  questions: [
    {
      id: 1,
      text: 'Jaka jest stolica Francji?',
      answers: ['Londyn', 'Berlin', 'Paryż', 'Madryt'],
      correctAnswerIndex: 2,
      hint: 'Pomyśl o Wieży Eiffla!'
    },
    {
      id: 2,
      text: 'Ile planet jest w naszym Układzie Słonecznym?',
      answers: ['7', '8', '9', '10'],
      correctAnswerIndex: 1,
      hint: 'Pluton został przeklasyfikowany w 2006 roku!'
    },
    {
      id: 3,
      text: 'Jaki kolor powstaje po zmieszaniu czerwonego i żółtego?',
      answers: ['Zielony', 'Fioletowy', 'Pomarańczowy', 'Różowy'],
      correctAnswerIndex: 2,
      hint: 'Pomyśl o owocu cytrusowym!'
    }
  ],
  audio: {
    welcome: 'assets/audio/welcome.mp3',
    question: 'assets/audio/question.mp3',
    reward: 'assets/audio/reward.mp3',
    correct: 'assets/audio/correct.mp3',
    incorrect: 'assets/audio/incorrect.mp3'
  },
  images: {
    host: 'assets/images/host.svg',
    ticket: 'assets/images/ticket.svg',
    scratchOverlay: 'assets/images/scratch-overlay.png'
  },
  ui: {
    welcomeTitle: '🎉 Urodzinowy Teleturniej! 🎉',
    welcomeMessage: 'Odpowiedz na 3 pytania, aby odkryć swoją wyjątkową niespodziankę!',
    playButtonText: 'GRAJ',
    rewardTitle: '🎊 Gratulacje! 🎊',
    rewardMessage: 'Zdrap, aby odkryć niespodziankę!',
    playAgainText: 'Zagraj ponownie'
  }
};
