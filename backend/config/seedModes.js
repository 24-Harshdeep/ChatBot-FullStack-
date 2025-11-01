const Mode = require('../models/Mode');

const modesData = [
  {
    name: 'developer',
    displayName: 'Developer Assistant',
    icon: '💻',
    description: 'Technical coding assistance and debugging',
    systemPrompt: 'You are a Developer Assistant AI. Be concise, technical, and logical.',
    greeting: "Let's crush some code, {name}.",
    themes: [
      {
        name: 'neural-blue',
        displayName: 'Neural Blue',
        colors: {
          primary: '#1E88E5',
          secondary: '#90CAF9',
          accent: '#E3F2FD',
          background: '#E3F2FD',
          backgroundGradient: ['#E3F2FD', '#BBDEFB', '#90CAF9'],
          text: '#0D47A1',
          textSecondary: '#1565C0',
          userBubble: '#1E88E5',
          aiBubble: '#BBDEFB',
          border: '#90CAF960'
        }
      },
      {
        name: 'midnight-cyan',
        displayName: 'Midnight Cyan',
        colors: {
          primary: '#00ACC1',
          secondary: '#26C6DA',
          accent: '#80DEEA',
          background: '#0E141B',
          backgroundGradient: ['#0E141B', '#1a2530', '#0E141B'],
          text: '#f5f5f5',
          textSecondary: '#b0bec5',
          userBubble: '#00ACC1',
          aiBubble: '#1a2530',
          border: '#00ACC160'
        }
      },
      {
        name: 'cyber-indigo',
        displayName: 'Cyber Indigo',
        colors: {
          primary: '#3949AB',
          secondary: '#5C6BC0',
          accent: '#9FA8DA',
          background: '#0A0D1A',
          backgroundGradient: ['#0A0D1A', '#1a1f3a', '#0A0D1A'],
          text: '#f5f5f5',
          textSecondary: '#c5cae9',
          userBubble: '#3949AB',
          aiBubble: '#1a1f3a',
          border: '#3949AB60'
        }
      },
      {
        name: 'graphite-silver',
        displayName: 'Graphite Silver',
        colors: {
          primary: '#B0BEC5',
          secondary: '#CFD8DC',
          accent: '#ECEFF1',
          background: '#121212',
          backgroundGradient: ['#121212', '#1e1e1e', '#121212'],
          text: '#f5f5f5',
          textSecondary: '#cfd8dc',
          userBubble: '#B0BEC5',
          aiBubble: '#1e1e1e',
          border: '#B0BEC560'
        }
      }
    ]
  },
  {
    name: 'learner',
    displayName: 'Learning Mode',
    icon: '🎓',
    description: 'Interactive tutoring and skill development',
    systemPrompt: 'You are a Learning and Tutoring AI. Be encouraging, patient, and make learning fun.',
    greeting: "Ready for your next challenge, {name}?",
    themes: [
      {
        name: 'aurora-teal',
        displayName: 'Aurora Teal',
        colors: {
          primary: '#00897B',
          secondary: '#4DB6AC',
          accent: '#E0F2F1',
          background: '#E0F2F1',
          backgroundGradient: ['#E0F2F1', '#B2DFDB', '#80CBC4'],
          text: '#004D40',
          textSecondary: '#00695C',
          userBubble: '#00897B',
          aiBubble: '#B2DFDB',
          border: '#4DB6AC60'
        }
      },
      {
        name: 'cosmic-lilac',
        displayName: 'Cosmic Lilac',
        colors: {
          primary: '#7E57C2',
          secondary: '#B39DDB',
          accent: '#EDE7F6',
          background: '#EDE7F6',
          backgroundGradient: ['#EDE7F6', '#D1C4E9', '#B39DDB'],
          text: '#4A148C',
          textSecondary: '#6A1B9A',
          userBubble: '#7E57C2',
          aiBubble: '#D1C4E9',
          border: '#B39DDB60'
        }
      },
      {
        name: 'obsidian-purple',
        displayName: 'Obsidian Purple',
        colors: {
          primary: '#8E24AA',
          secondary: '#AB47BC',
          accent: '#CE93D8',
          background: '#1A0B24',
          backgroundGradient: ['#1A0B24', '#2d1b3d', '#1A0B24'],
          text: '#f5f5f5',
          textSecondary: '#e1bee7',
          userBubble: '#8E24AA',
          aiBubble: '#2d1b3d',
          border: '#8E24AA60'
        }
      },
      {
        name: 'sage-green',
        displayName: 'Sage Green',
        colors: {
          primary: '#43A047',
          secondary: '#A5D6A7',
          accent: '#E8F5E9',
          background: '#E8F5E9',
          backgroundGradient: ['#E8F5E9', '#C8E6C9', '#A5D6A7'],
          text: '#1B5E20',
          textSecondary: '#2E7D32',
          userBubble: '#43A047',
          aiBubble: '#C8E6C9',
          border: '#A5D6A760'
        }
      }
    ]
  },
  {
    name: 'hr',
    displayName: 'HR/IT Operations',
    icon: '🧾',
    description: 'Professional HR and IT support',
    systemPrompt: 'You are an HR and IT Operations Assistant. Be polished, professional, and supportive.',
    greeting: "Welcome back, {name}. Let's keep operations smooth.",
    themes: [
      {
        name: 'solar-amber',
        displayName: 'Solar Amber',
        colors: {
          primary: '#F9A825',
          secondary: '#FFD54F',
          accent: '#FFF8E1',
          background: '#FFF8E1',
          backgroundGradient: ['#FFF8E1', '#FFECB3', '#FFD54F'],
          text: '#F57F17',
          textSecondary: '#F9A825',
          userBubble: '#F9A825',
          aiBubble: '#FFECB3',
          border: '#FFD54F60'
        }
      },
      {
        name: 'emerald-noir',
        displayName: 'Emerald Noir',
        colors: {
          primary: '#2E7D32',
          secondary: '#66BB6A',
          accent: '#A5D6A7',
          background: '#0C1A0C',
          backgroundGradient: ['#0C1A0C', '#1b4d1b', '#0C1A0C'],
          text: '#f5f5f5',
          textSecondary: '#a5d6a7',
          userBubble: '#2E7D32',
          aiBubble: '#1b4d1b',
          border: '#2E7D3260'
        }
      },
      {
        name: 'crimson-edge',
        displayName: 'Crimson Edge',
        colors: {
          primary: '#E53935',
          secondary: '#EF9A9A',
          accent: '#FFEBEE',
          background: '#FFEBEE',
          backgroundGradient: ['#FFEBEE', '#FFCDD2', '#EF9A9A'],
          text: '#B71C1C',
          textSecondary: '#C62828',
          userBubble: '#E53935',
          aiBubble: '#FFCDD2',
          border: '#EF9A9A60'
        }
      },
      {
        name: 'sunset-coral',
        displayName: 'Sunset Coral',
        colors: {
          primary: '#FF7043',
          secondary: '#FF8A65',
          accent: '#FFCCBC',
          background: '#1A0E0A',
          backgroundGradient: ['#1A0E0A', '#3d1f1a', '#1A0E0A'],
          text: '#f5f5f5',
          textSecondary: '#ffccbc',
          userBubble: '#FF7043',
          aiBubble: '#3d1f1a',
          border: '#FF704360'
        }
      }
    ]
  }
];

async function seedModes() {
  try {
    // Clear existing modes
    await Mode.deleteMany({});
    
    // Insert new modes
    await Mode.insertMany(modesData);
    
    console.log('✅ Modes seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding modes:', error);
  }
}

module.exports = { seedModes };
