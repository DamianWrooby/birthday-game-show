import { GameConfig } from './interfaces/game-config.interface';

export const GAME_CONFIG: GameConfig = {
  questions: [
    {
      id: 1,
      text: 'Jeśli, pytając czysto teoretycznie, zdecydowałabyś się na kolejnego psa, jaka rasa byłaby najlepszym wyborem?',
      answers: ['Pudel', 'Chihuahua', 'Corgi', 'Papillon'],
      correctAnswerIndex: 2,
      hint: 'Puszysty na krótkich łapach',
      audio: 'assets/audio/question_1.mp3'
    },
    {
      id: 2,
      text: 'Jaka jest pierwsza oznaka starzenia się?',
      answers: ['Ból pleców', 'Rezygnowanie z wyjść ze znajomymi', 'Mówienie na głos oczywistych rzeczy', 'Zainteresowanie ogrodnictwem'],
      correctAnswerIndex: 2,
      hint: '"Ale jak śnieg spadnie to powietrze od razu inne"',
      audio: 'assets/audio/question_2.mp3'
    },
    {
      id: 3,
      text: 'Wanna to urządzenie służące do...',
      answers: ['Siedzenia', 'Kąpieli', 'Makijażu', 'Depilacji'],
      correctAnswerIndex: 1,
      hint: 'Gdzieś w głębi duszy znasz prawidłową odpowiedź',
      audio: 'assets/audio/question_3.mp3'
    }
  ],
  audio: {
    welcome: 'assets/audio/welcome.mp3',
    reward: 'assets/audio/reward.mp3',
    correct: 'assets/audio/correct.mp3',
    incorrect: 'assets/audio/incorrect.mp3',
    scratchComplete: 'assets/audio/scratch_complete.mp3'
  },
  images: {
    host: 'assets/images/host.png',
    ticket: 'assets/images/ticket.png',
    scratchOverlay: 'assets/images/scratch-overlay.png'
  },
  ui: {
    welcomeTitle: 'Urodzinowy Teleturniej!',
    welcomeMessage: 'Witaj Różo! Odpowiedz na 3 pytania, aby wygrać niesamowitą nagrodę!',
    playButtonText: 'GRAJ',
    rewardTitle: 'Gratulacje!',
    rewardMessage: 'Zdrap, aby odkryć niespodziankę!',
    playAgainText: 'Zagraj ponownie'
  }
};
