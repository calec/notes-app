// Tiny localStorage wrapper plus the demo account the hosted demo ships with.
export const DEMO_EMAIL = 'demo@grantsnotes.app';
export const DEMO_PASSWORD = 'grantsnotes';

const SEED_KEY = 'gn_seeded_v1';

export const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

export const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
};

const leaf = (text, marks) => ({ text, marks: (marks || []).map(type => ({ type })) });

const paragraph = (...leaves) => ({
  object: 'block',
  type: 'paragraph',
  nodes: [{ object: 'text', leaves: leaves.map(l => (typeof l === 'string' ? leaf(l) : l)) }],
});

const doc = (...blocks) => ({ document: { nodes: blocks } });

const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();

export const seedDemoData = () => {
  if (read(SEED_KEY, false)) return;

  const users = read('gn_users', {});
  users[DEMO_EMAIL] = { uid: 'u_demo', password: DEMO_PASSWORD, username: 'Demo User' };
  users['grant@grantsnotes.app'] = { uid: 'u_grant', password: Math.random().toString(36), username: 'Grant' };
  write('gn_users', users);

  const notes = [
    {
      _id: 'seed_welcome',
      title: 'Welcome to GrantsNotes',
      userId: DEMO_EMAIL,
      dateAdded: daysAgo(0),
      sharedWith: [],
      content: doc(
        paragraph(leaf('GrantsNotes', ['bold']), ' is a collaborative note taking app, originally built as a five-person team project with React, Material UI, Firebase and MongoDB.'),
        paragraph(''),
        paragraph(leaf('Try it out:', ['underline'])),
        paragraph(leaf('Click the + in the left drawer to create a note', ['list'])),
        paragraph(leaf('Double click a note title to rename it', ['list'])),
        paragraph(leaf('Right click a note to share or delete it', ['list'])),
        paragraph(leaf('Use the toolbar or Ctrl+B / Ctrl+I / Ctrl+U to format text', ['list'])),
        paragraph(''),
        paragraph(leaf('This hosted demo stores everything in your browser, so your notes stay on this device.', ['italic']))
      ),
    },
    {
      _id: 'seed_groceries',
      title: 'Groceries',
      userId: DEMO_EMAIL,
      dateAdded: daysAgo(1),
      sharedWith: [],
      content: doc(
        paragraph(leaf('Coffee beans', ['list'])),
        paragraph(leaf('Oat milk', ['list'])),
        paragraph(leaf('Sourdough', ['list']))
      ),
    },
    {
      _id: 'seed_standup',
      title: 'Standup notes',
      userId: DEMO_EMAIL,
      dateAdded: daysAgo(2),
      sharedWith: [],
      content: doc(
        paragraph(leaf('Yesterday: ', ['bold']), 'wired up note sharing by email.'),
        paragraph(leaf('Today: ', ['bold']), 'dark theme toggle and title editing.'),
        paragraph(leaf('Blockers: ', ['bold']), 'none.')
      ),
    },
    {
      _id: 'seed_shared',
      title: 'Team project ideas',
      userId: 'grant@grantsnotes.app',
      dateAdded: daysAgo(3),
      sharedWith: [DEMO_EMAIL],
      content: doc(
        paragraph('Shared with you by Grant. You can edit the body of shared notes, but only the owner can rename or delete them.'),
        paragraph(''),
        paragraph(leaf('Realtime collaborative editing', ['list'])),
        paragraph(leaf('Note folders and tags', ['list']))
      ),
    },
  ];

  write('gn_notes', [...read('gn_notes', []), ...notes]);
  write(SEED_KEY, true);
};
