(() => {
  'use strict';

  const DB_NAME = 'ficha-de-aventura';
  const DB_VERSION = 1;
  const SESSION_KEY = 'ficha-de-aventura-perfil';
  const HASH_ITERATIONS = 180000;
  const ABILITIES = [
    { key: 'str', label: 'FOR', long: 'Força' },
    { key: 'dex', label: 'DES', long: 'Destreza' },
    { key: 'con', label: 'CON', long: 'Constituição' },
    { key: 'int', label: 'INT', long: 'Inteligência' },
    { key: 'wis', label: 'SAB', long: 'Sabedoria' },
    { key: 'cha', label: 'CAR', long: 'Carisma' }
  ];
  const CLASS_OPTIONS = [
    'Bárbaro', 'Bardo', 'Clérigo', 'Druida', 'Guerreiro', 'Monge',
    'Paladino', 'Patrulheiro', 'Ladino', 'Feiticeiro', 'Bruxo', 'Mago'
  ].map(value => ({ value, label: value }));
  const SPECIES_OPTIONS = {
    '2014': ['Anão', 'Draconato', 'Elfo', 'Gnomo', 'Halfling', 'Meio-elfo', 'Meio-orc', 'Tiefling', 'Humano'],
    'revised-2024': ['Aasimar', 'Anão', 'Draconato', 'Elfo', 'Gnomo', 'Golias', 'Halfling', 'Humano', 'Orc', 'Tiefling'],
    other: ['Aasimar', 'Anão', 'Draconato', 'Elfo', 'Gnomo', 'Golias', 'Halfling', 'Humano', 'Meio-elfo', 'Meio-orc', 'Orc', 'Tiefling']
  };
  const BACKGROUND_OPTIONS = {
    '2014': ['Acólito', 'Charlatão', 'Criminoso', 'Artista', 'Herói do Povo', 'Artesão de Guilda', 'Eremita', 'Nobre', 'Forasteiro', 'Sábio', 'Marinheiro', 'Soldado', 'Órfão de Rua'],
    'revised-2024': ['Acólito', 'Artesão', 'Charlatão', 'Criminoso', 'Artista', 'Fazendeiro', 'Guarda', 'Guia', 'Eremita', 'Mercador', 'Nobre', 'Sábio', 'Marinheiro', 'Escriba', 'Soldado', 'Viajante'],
    other: ['Acólito', 'Artesão', 'Artesão de Guilda', 'Artista', 'Charlatão', 'Criminoso', 'Eremita', 'Escriba', 'Fazendeiro', 'Forasteiro', 'Guarda', 'Guia', 'Herói do Povo', 'Marinheiro', 'Mercador', 'Nobre', 'Órfão de Rua', 'Sábio', 'Soldado', 'Viajante']
  };
  const ALIGNMENT_OPTIONS = [
    'Sem tendência', 'Leal e bom', 'Neutro e bom', 'Caótico e bom', 'Leal e neutro',
    'Neutro', 'Caótico e neutro', 'Leal e mau', 'Neutro e mau', 'Caótico e mau'
  ].map(value => ({ value, label: value }));
  const SUBCLASS_OPTIONS = {
    '2014': {
      Bárbaro: ['Caminho do Berserker', 'Guerreiro Totêmico'],
      Bardo: ['Colégio do Conhecimento', 'Colégio do Valor'],
      Clérigo: ['Domínio do Conhecimento', 'Domínio da Enganação', 'Domínio da Guerra', 'Domínio da Luz', 'Domínio da Natureza', 'Domínio da Tempestade', 'Domínio da Vida'],
      Druida: ['Círculo da Terra', 'Círculo da Lua'],
      Guerreiro: ['Campeão', 'Cavaleiro Arcano', 'Mestre de Batalha'],
      Monge: ['Caminho dos Quatro Elementos', 'Caminho da Mão Aberta', 'Caminho da Sombra'],
      Paladino: ['Juramento da Devoção', 'Juramento dos Ancestrais', 'Juramento da Vingança'],
      Patrulheiro: ['Caçador', 'Mestre das Feras'],
      Ladino: ['Assassino', 'Ladrão', 'Trapaceiro Arcano'],
      Feiticeiro: ['Magia Selvagem', 'Linhagem Dracônica'],
      Bruxo: ['Arquifada', 'Grande Antigo', 'Ínfero'],
      Mago: ['Abjurador', 'Adivinho', 'Conjurador', 'Encantador', 'Evocador', 'Ilusionista', 'Necromante', 'Transmutador']
    },
    'revised-2024': {
      Bárbaro: ['Berserker', 'Coração Selvagem', 'Árvore do Mundo', 'Fanático'],
      Bardo: ['Dança', 'Glamour', 'Conhecimento', 'Valor'],
      Clérigo: ['Vida', 'Luz', 'Enganação', 'Guerra'],
      Druida: ['Terra', 'Lua', 'Mar', 'Estrelas'],
      Guerreiro: ['Mestre de Batalha', 'Campeão', 'Cavaleiro Arcano', 'Guerreiro Psiônico'],
      Monge: ['Elementos', 'Mão Aberta', 'Sombra', 'Misericórdia'],
      Paladino: ['Devoção', 'Glória', 'Ancestrais', 'Vingança'],
      Patrulheiro: ['Mestre das Feras', 'Andarilho Feérico', 'Perseguidor Sombrio', 'Caçador'],
      Ladino: ['Trapaceiro Arcano', 'Assassino', 'Lâmina Psíquica', 'Ladrão'],
      Feiticeiro: ['Aberrante', 'Mecânica', 'Dracônica', 'Magia Selvagem'],
      Bruxo: ['Arquifada', 'Celestial', 'Ínfero', 'Grande Antigo'],
      Mago: ['Abjurador', 'Adivinho', 'Evocador', 'Ilusionista']
    }
  };
  const CUSTOM_OPTION = '__custom__';
  const SKILLS = [
    ['Acrobacia', 'dex'], ['Adestrar animais', 'wis'], ['Arcanismo', 'int'],
    ['Atletismo', 'str'], ['Atuação', 'cha'], ['Enganação', 'cha'],
    ['Furtividade', 'dex'], ['História', 'int'], ['Intimidação', 'cha'],
    ['Intuição', 'wis'], ['Investigação', 'int'], ['Medicina', 'wis'],
    ['Natureza', 'int'], ['Percepção', 'wis'], ['Persuasão', 'cha'],
    ['Prestidigitação', 'dex'], ['Religião', 'int'], ['Sobrevivência', 'wis']
  ];
  const LEVEL_XP_THRESHOLDS = [
    0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
    85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000
  ];
  const WIZARD_STEPS = [
    { tab: 'essentials', title: 'Identidade e atributos', description: 'Dê um nome ao personagem, escolha classe e espécie e preencha os atributos que já conhece.' },
    { tab: 'combat', title: 'Combate e sobrevivência', description: 'Registre pontos de vida, defesa, deslocamento e ataques. Você pode deixar os valores em aberto.' },
    { tab: 'skills', title: 'Perícias e proficiências', description: 'Marque salvaguardas e perícias treinadas. Os totais são calculados pela ficha.' },
    { tab: 'story', title: 'História e personalidade', description: 'Anote aparência, ideais, vínculos e o passado do aventureiro — ou deixe para outra hora.' },
    { tab: 'inventory', title: 'Equipamento e moedas', description: 'Adicione itens e moedas que queira consultar durante a sessão.' },
    { tab: 'spells', title: 'Magias e revisão', description: 'Se o personagem conjura, registre suas magias e espaços. Depois, a ficha fica disponível nas abas normais.' }
  ];

  const state = {
    db: null,
    user: null,
    characters: [],
    activeCharacter: null,
    activeTab: 'essentials',
    wizardCharacterId: null,
    wizardStep: 0,
    authMode: 'login',
    saveTimer: null,
    saveQueue: Promise.resolve(),
    toastTimer: null
  };

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));
  const authView = $('#authView');
  const appView = $('#appView');
  const authForm = $('#authForm');
  const authMessage = $('#authMessage');
  const editorForm = $('#editorForm');
  const toastBox = $('#toast');

  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('accounts')) {
          db.createObjectStore('accounts', { keyPath: 'username' });
        }
        if (!db.objectStoreNames.contains('characters')) {
          const characters = db.createObjectStore('characters', { keyPath: 'id' });
          characters.createIndex('ownerId', 'ownerId', { unique: false });
          characters.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Não foi possível abrir o arquivo local.'));
      request.onblocked = () => reject(new Error('Feche outras abas desta página e tente novamente.'));
    });
  }

  function dbRequest(storeName, mode, action) {
    return new Promise((resolve, reject) => {
      const transaction = state.db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      let request;
      let result;
      try {
        request = action(store);
      } catch (error) {
        reject(error);
        return;
      }
      request.onsuccess = () => { result = request.result; };
      request.onerror = () => reject(request.error || new Error('Falha ao acessar o arquivo local.'));
      transaction.oncomplete = () => resolve(result);
      transaction.onerror = () => reject(transaction.error || new Error('Falha ao salvar no navegador.'));
      transaction.onabort = () => reject(transaction.error || new Error('A alteração foi cancelada.'));
    });
  }

  function hex(bytes) {
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  function unhex(value) {
    const pairs = value.match(/.{1,2}/g) || [];
    return Uint8Array.from(pairs, pair => parseInt(pair, 16));
  }

  async function hashPassword(password, saltHex) {
    if (!window.crypto?.subtle) {
      throw new Error('O navegador não habilitou a proteção local. Abra a página em uma conexão HTTPS ou localhost.');
    }
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: saltHex ? unhex(saltHex) : crypto.getRandomValues(new Uint8Array(16)),
      iterations: HASH_ITERATIONS
    }, key, 256);
    return hex(new Uint8Array(bits));
  }

  function newId() {
    return window.crypto?.randomUUID ? crypto.randomUUID() : `ficha-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function blankCharacter(ownerId, playerName = '') {
    const skillValues = {};
    for (const [name] of SKILLS) skillValues[name] = { proficient: false, expertise: false };
    return {
      id: newId(),
      ownerId,
      avatarDataUrl: '',
      identity: {
        characterName: 'Novo personagem', player: playerName, class: '', subclass: '', level: 1,
        species: '', background: '', alignment: '', experience: 0, levelAuto: true, system: 'revised-2024'
      },
      abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      combat: {
        hpMax: 0, hpCurrent: 0, hpTemp: 0, armorClass: 10, initiativeAdjustment: 0,
        speed: 30, hitDice: '1d8', inspiration: false, deathSuccess: 0, deathFailure: 0
      },
      savingThrows: { str: false, dex: false, con: false, int: false, wis: false, cha: false },
      skills: skillValues,
      attacks: [],
      proficienciesLanguages: '',
      appearance: { age: '', height: '', weight: '', eyes: '', skin: '', hair: '', description: '' },
      story: {
        personalityTraits: '', ideals: '', bonds: '', flaws: '', backstory: '',
        allies: '', organizations: '', symbol: '', treasure: ''
      },
      inventory: { equipment: '', copper: 0, silver: 0, electrum: 0, gold: 0, platinum: 0 },
      spellcasting: { className: '', ability: '', spellSaveDC: '', attackBonus: '' },
      spellSlots: Object.fromEntries(Array.from({ length: 9 }, (_, index) => [String(index + 1), { total: 0, used: 0 }])),
      spellLists: Object.fromEntries(Array.from({ length: 10 }, (_, level) => [String(level), ''])),
      features: '', spells: '', notes: '',
      updatedAt: new Date().toISOString()
    };
  }

  function normalizeCharacter(source, ownerId, playerName = '') {
    const base = blankCharacter(ownerId, playerName);
    const character = source && typeof source === 'object' ? source : {};
    const savedIdentity = character.identity || {};
    const savedLevel = Math.min(20, Math.max(1, Number(savedIdentity.level) || 1));
    const savedExperience = Math.max(0, Number(savedIdentity.experience) || 0);
    const experience = savedIdentity.levelAuto === true
      ? savedExperience
      : Math.max(savedExperience, LEVEL_XP_THRESHOLDS[savedLevel - 1]);
    const identity = {
      ...base.identity,
      ...savedIdentity,
      experience,
      level: levelForExperience(experience),
      levelAuto: true
    };
    const spellSlots = Object.fromEntries(Array.from({ length: 9 }, (_, index) => {
      const level = String(index + 1);
      return [level, { ...base.spellSlots[level], ...(character.spellSlots?.[level] || {}) }];
    }));
    return {
      ...base,
      ...character,
      ownerId,
      identity,
      abilities: { ...base.abilities, ...(character.abilities || {}) },
      combat: { ...base.combat, ...(character.combat || {}) },
      savingThrows: { ...base.savingThrows, ...(character.savingThrows || {}) },
      skills: { ...base.skills, ...(character.skills || {}) },
      attacks: Array.isArray(character.attacks) ? character.attacks : [],
      proficienciesLanguages: character.proficienciesLanguages || '',
      appearance: { ...base.appearance, ...(character.appearance || {}) },
      story: { ...base.story, ...(character.story || {}) },
      inventory: { ...base.inventory, ...(character.inventory || {}) },
      spellcasting: { ...base.spellcasting, ...(character.spellcasting || {}) },
      spellSlots,
      spellLists: { ...base.spellLists, ...(character.spellLists || {}) }
    };
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function safeAvatar(value) {
    return typeof value === 'string' && /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value) ? value : '';
  }

  function formatXP(value) {
    const amount = Number(value);
    return new Intl.NumberFormat('pt-BR').format(Number.isFinite(amount) ? Math.max(0, amount) : 0);
  }

  function signed(value) {
    const amount = Number(value) || 0;
    return amount >= 0 ? `+${amount}` : String(amount);
  }

  function abilityModifier(score) {
    const parsed = Number(score);
    if (!Number.isFinite(parsed)) return 0;
    return Math.floor((parsed - 10) / 2);
  }

  function proficiencyBonus(level) {
    const parsed = Math.min(20, Math.max(1, Number(level) || 1));
    return 2 + Math.floor((parsed - 1) / 4);
  }

  function levelForExperience(experience) {
    const value = Number(experience);
    const xp = Number.isFinite(value) ? Math.max(0, value) : 0;
    let level = 1;
    for (let index = 1; index < LEVEL_XP_THRESHOLDS.length; index += 1) {
      if (xp < LEVEL_XP_THRESHOLDS[index]) break;
      level = index + 1;
    }
    return level;
  }

  function experienceProgress(experience) {
    const value = Number(experience);
    const xp = Number.isFinite(value) ? Math.max(0, value) : 0;
    const level = levelForExperience(xp);
    const currentThreshold = LEVEL_XP_THRESHOLDS[level - 1];
    const nextThreshold = LEVEL_XP_THRESHOLDS[level];
    if (nextThreshold === undefined) {
      return { level, percent: 100, message: `Nível máximo · ${formatXP(currentThreshold)} XP necessários` };
    }
    const percent = Math.max(0, Math.min(100, Math.floor((xp - currentThreshold) / (nextThreshold - currentThreshold) * 100)));
    return {
      level,
      percent,
      message: `Faltam ${formatXP(nextThreshold - xp)} XP para o nível ${level + 1} (${formatXP(nextThreshold)} XP no total)`
    };
  }

  function setAuthMode(mode) {
    state.authMode = mode;
    const signup = mode === 'signup';
    $$('.auth-tab').forEach(button => {
      const active = button.dataset.authMode === mode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    $('#displayNameField').hidden = !signup;
    const displayNameInput = authForm.elements.displayName;
    displayNameInput.required = signup;
    authForm.elements.password.autocomplete = signup ? 'new-password' : 'current-password';
    $('#authSubmit').textContent = signup ? 'Criar perfil local' : 'Entrar';
    $('#authTitle').textContent = signup ? 'Crie seu perfil local' : 'Entre no seu arquivo';
    $('#authDescription').textContent = signup
      ? 'Escolha um usuário para entrar neste perfil. Os nomes do jogador e dos personagens são campos separados.'
      : 'Entre com o usuário da conta e a senha. O nome do jogador ou do personagem não é usado para entrar.';
    authMessage.textContent = '';
    authMessage.classList.remove('success');
  }

  function showAuthMessage(message, success = false) {
    authMessage.textContent = message;
    authMessage.classList.toggle('success', success);
  }

  async function handleAuth(event) {
    event.preventDefault();
    const formData = new FormData(authForm);
    const username = String(formData.get('username') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '');
    const displayName = String(formData.get('displayName') || '').trim();
    const submit = $('#authSubmit');
    submit.disabled = true;
    showAuthMessage(state.authMode === 'signup' ? 'Criando seu perfil…' : 'Abrindo seu arquivo…', true);
    try {
      if (!/^[a-z0-9._-]{3,24}$/.test(username)) {
        throw new Error('O nome de usuário precisa ter de 3 a 24 caracteres: letras sem acento, números, ponto, traço ou sublinhado.');
      }
      if (password.length < 8) throw new Error('Use uma senha com pelo menos 8 caracteres.');
      let account;
      if (state.authMode === 'signup') {
        if (!displayName) throw new Error('Digite o nome visível do jogador.');
        const existing = await dbRequest('accounts', 'readonly', store => store.get(username));
        if (existing) throw new Error('Esse nome de usuário já existe neste navegador. Escolha outro ou entre no perfil.');
        const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
        const passwordHash = await hashPassword(password, salt);
        account = { username, displayName: displayName.slice(0, 40), salt, passwordHash, createdAt: new Date().toISOString() };
        await dbRequest('accounts', 'readwrite', store => store.add(account));
      } else {
        account = await dbRequest('accounts', 'readonly', store => store.get(username));
        if (!account) throw new Error('Nome de usuário ou senha não conferem.');
        const attempt = await hashPassword(password, account.salt);
        if (attempt !== account.passwordHash) throw new Error('Nome de usuário ou senha não conferem.');
      }
      authForm.reset();
      sessionStorage.setItem(SESSION_KEY, account.username);
      await enterApp(account);
    } catch (error) {
      showAuthMessage(error.message || 'Não foi possível abrir o perfil. Tente novamente.');
    } finally {
      submit.disabled = false;
    }
  }

  async function enterApp(account) {
    state.user = account;
    state.activeCharacter = null;
    const savedCharacters = await dbRequest('characters', 'readonly', store => store.index('ownerId').getAll(account.username));
    state.characters = savedCharacters.map(character => normalizeCharacter(character, account.username, account.displayName));
    state.characters.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
    authView.hidden = true;
    appView.hidden = false;
    $('#userDisplayName').textContent = account.displayName;
    $('#userInitials').textContent = account.displayName.trim().charAt(0).toUpperCase() || 'A';
    $('#welcomeName').textContent = account.displayName;
    renderSidebar();
    renderDashboard();
  }

  function goToLogin() {
    state.user = null;
    state.activeCharacter = null;
    state.characters = [];
    state.saveQueue = Promise.resolve();
    sessionStorage.removeItem(SESSION_KEY);
    appView.hidden = true;
    authView.hidden = false;
    authForm.reset();
    setAuthMode('login');
  }

  function renderSidebar() {
    $('#sheetCount').textContent = String(state.characters.length);
    const list = $('#characterList');
    list.replaceChildren();
    for (const character of state.characters) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `character-nav-item${state.activeCharacter?.id === character.id ? ' active' : ''}`;
      button.setAttribute('aria-label', `Abrir ficha de ${character.identity?.characterName || 'personagem'}`);
      const icon = document.createElement('span');
      icon.className = 'character-nav-icon';
      const avatarUrl = safeAvatar(character.avatarDataUrl);
      if (avatarUrl) {
        const image = document.createElement('img');
        image.src = avatarUrl;
        image.alt = '';
        icon.append(image);
      } else {
        icon.textContent = (character.identity?.characterName || '?').trim().charAt(0).toUpperCase() || '?';
      }
      const text = document.createElement('span');
      text.className = 'character-nav-text';
      const name = document.createElement('strong');
      name.textContent = character.identity?.characterName || 'Sem nome';
      const details = document.createElement('small');
      details.textContent = [choiceValue(character.identity, 'class'), character.identity?.level ? `Nível ${character.identity.level}` : ''].filter(Boolean).join(' · ') || 'Ficha em construção';
      text.append(name, details);
      button.append(icon, text);
      button.addEventListener('click', () => openCharacter(character.id));
      list.append(button);
    }
  }

  function renderDashboard() {
    $('#dashboard').hidden = false;
    $('#characterEditor').hidden = true;
    $('#mobileSummary').open = false;
    $('#mainContent').classList.remove('mobile-summary-open');
    $('#allSheetsButton').classList.add('active');
    $('#dashboardCount').textContent = `(${state.characters.length})`;
    const grid = $('#sheetGrid');
    grid.replaceChildren();
    for (const character of state.characters) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'sheet-card';
      button.setAttribute('aria-label', `Abrir ficha de ${character.identity?.characterName || 'personagem'}`);
      const top = document.createElement('div');
      top.className = 'sheet-card-top';
      const seal = document.createElement('span');
      seal.className = 'sheet-seal';
      const avatarUrl = safeAvatar(character.avatarDataUrl);
      if (avatarUrl) {
        const image = document.createElement('img');
        image.src = avatarUrl;
        image.alt = '';
        seal.append(image);
      } else {
        seal.textContent = (character.identity?.characterName || '?').trim().charAt(0).toUpperCase() || '?';
      }
      const level = document.createElement('span');
      level.className = 'sheet-level';
      level.textContent = `NÍVEL ${character.identity?.level || 1}`;
      top.append(seal, level);
      const title = document.createElement('h3');
      title.textContent = character.identity?.characterName || 'Sem nome';
      const sub = document.createElement('p');
      sub.textContent = [choiceValue(character.identity, 'species'), choiceValue(character.identity, 'class')].filter(Boolean).join(' · ') || 'Ficha em construção';
      const footer = document.createElement('div');
      footer.className = 'sheet-card-footer';
      const updated = document.createElement('span');
      updated.textContent = `Atualizada ${formatDate(character.updatedAt)}`;
      const open = document.createElement('span');
      open.textContent = 'ABRIR →';
      footer.append(updated, open);
      button.append(top, title, sub, footer);
      button.addEventListener('click', () => openCharacter(character.id));
      grid.append(button);
    }
    $('#emptyState').hidden = state.characters.length > 0;
    grid.hidden = state.characters.length === 0;
    renderSidebar();
  }

  function formatDate(value) {
    if (!value) return 'agora';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'agora';
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }

  async function createCharacter() {
    await flushSave();
    const character = blankCharacter(state.user.username, state.user.displayName);
    await dbRequest('characters', 'readwrite', store => store.add(character));
    state.characters.unshift(character);
    state.wizardCharacterId = character.id;
    state.wizardStep = 0;
    await openCharacter(character.id);
    toast('Ficha criada. O guia é opcional e suas alterações são salvas automaticamente.');
  }

  async function openCharacter(id) {
    if (state.activeCharacter?.id !== id) await flushSave();
    const character = state.characters.find(item => item.id === id);
    if (!character) return;
    if (state.wizardCharacterId && state.wizardCharacterId !== id) {
      state.wizardCharacterId = null;
      state.wizardStep = 0;
    }
    state.activeCharacter = character;
    state.activeTab = 'essentials';
    $('#dashboard').hidden = true;
    $('#characterEditor').hidden = false;
    $('#allSheetsButton').classList.remove('active');
    renderSidebar();
    renderEditor();
  }

  function field(label, path, value, options = {}) {
    const { type = 'text', placeholder = '', span = '', hint = '', min, max, step = '1' } = options;
    const spanClass = span ? ` ${span}` : '';
    const constraints = type === 'number'
      ? ` inputmode="numeric"${min !== undefined ? ` min="${min}"` : ''}${max !== undefined ? ` max="${max}"` : ''} step="${step}"`
      : '';
    return `<label class="field${spanClass}"><span>${escapeHtml(label)}</span><input class="sheet-input" type="${type}" data-path="${escapeHtml(path)}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}"${constraints} />${hint ? `<small>${escapeHtml(hint)}</small>` : ''}</label>`;
  }

  function textareaField(label, path, value, options = {}) {
    const { placeholder = '', span = '', tall = false, hint = '' } = options;
    return `<label class="field${span ? ` ${span}` : ''}"><span>${escapeHtml(label)}</span><textarea class="sheet-input${tall ? ' tall' : ''}" data-path="${escapeHtml(path)}" placeholder="${escapeHtml(placeholder)}">${escapeHtml(value)}</textarea>${hint ? `<small>${escapeHtml(hint)}</small>` : ''}</label>`;
  }

  function selectField(label, path, value, options, span = '', refresh = false) {
    const current = String(value ?? '');
    const optionHtml = options.map(option => `<option value="${escapeHtml(option.value)}"${String(option.value) === current ? ' selected' : ''}>${escapeHtml(option.label)}</option>`).join('');
    return `<label class="field${span ? ` ${span}` : ''}"><span>${escapeHtml(label)}</span><select class="sheet-input" data-path="${escapeHtml(path)}"${refresh ? ' data-refresh-select="true"' : ''}>${optionHtml}</select></label>`;
  }

  function selectWithOther(label, path, value, options, customPath, span = '') {
    const current = String(value ?? '');
    const match = options.find(option => String(option.value).toLocaleLowerCase('pt-BR') === current.toLocaleLowerCase('pt-BR'));
    const isCustom = current === CUSTOM_OPTION || Boolean(current && !match);
    const selectedValue = isCustom ? CUSTOM_OPTION : match?.value || '';
    const optionHtml = [
      { value: '', label: 'Selecione…' },
      ...options,
      { value: CUSTOM_OPTION, label: 'Outra / personalizada' }
    ].map(option => `<option value="${escapeHtml(option.value)}"${String(option.value) === String(selectedValue) ? ' selected' : ''}>${escapeHtml(option.label)}</option>`).join('');
    const customKey = customPath.split('.').at(-1);
    const customValue = current === CUSTOM_OPTION ? state.activeCharacter?.identity?.[customKey] || '' : isCustom ? current : '';
    return `<div class="field select-with-other${span ? ` ${span}` : ''}"><span>${escapeHtml(label)}</span><select class="sheet-input" data-path="${escapeHtml(path)}" data-custom-path="${escapeHtml(customPath)}" data-refresh-select="true">${optionHtml}</select>${isCustom ? `<label class="select-custom-field"><span>Nome personalizado</span><input class="sheet-input" type="text" data-path="${escapeHtml(customPath)}" data-custom-value-for="${escapeHtml(path)}" value="${escapeHtml(customValue)}" placeholder="Digite aqui" /></label>` : ''}</div>`;
  }

  function choiceValue(identity, key) {
    const value = identity?.[key];
    if (value === CUSTOM_OPTION) return identity?.[`${key}Custom`] || '';
    return value || '';
  }

  function matchingOption(options, value) {
    return options.find(option => String(option.value).toLocaleLowerCase('pt-BR') === String(value ?? '').toLocaleLowerCase('pt-BR'));
  }

  function section(title, subtitle, content) {
    return `<section class="form-section"><div class="form-section-header"><div><h2>${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ''}</div></div>${content}</section>`;
  }

  function levelProgressField(experience) {
    const progress = experienceProgress(experience);
    return `<div class="field level-summary" aria-live="polite"><span>Nível automático</span><output class="level-number" data-level-output>${progress.level}</output><div class="xp-progress-track" role="progressbar" aria-label="Progresso até o próximo nível" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress.percent}" aria-valuetext="${escapeHtml(progress.message)}"><div class="xp-progress-fill" data-xp-progress style="width: ${progress.percent}%"></div></div><small data-xp-guidance>${escapeHtml(progress.message)}</small></div>`;
  }

  function renderEditor() {
    const character = state.activeCharacter;
    if (!character) return;
    const guided = state.wizardCharacterId === character.id;
    if (guided) {
      state.wizardStep = Math.max(0, Math.min(WIZARD_STEPS.length - 1, state.wizardStep));
      state.activeTab = WIZARD_STEPS[state.wizardStep].tab;
    }
    $('#editorTitle').textContent = character.identity.characterName || 'Novo personagem';
    $('#breadcrumbName').textContent = character.identity.characterName || 'Novo personagem';
    $('#editorSubtitle').textContent = [choiceValue(character.identity, 'species'), choiceValue(character.identity, 'class'), character.identity.level ? `Nível ${character.identity.level}` : ''].filter(Boolean).join(' · ') || 'Preencha o que souber; você pode voltar e editar depois.';
    $('#sheetTabs').hidden = guided;
    $('#wizardPanel').hidden = !guided;
    $('#wizardFooter').hidden = !guided;
    if (guided) {
      $('#wizardPanel').innerHTML = renderWizardPanel(state.wizardStep);
      $('#wizardFooter').innerHTML = renderWizardFooter(state.wizardStep);
    }
    $$('.sheet-tab').forEach(button => {
      const active = button.dataset.tab === state.activeTab;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    editorForm.innerHTML = renderTab(character, state.activeTab);
    updateComputed();
    $('#saveStatus').classList.remove('error', 'saving');
    $('#saveStatus').innerHTML = '<span class="status-dot"></span> Salvamento automático ativo';
    renderSidebar();
  }

  function renderWizardPanel(index) {
    const step = WIZARD_STEPS[index];
    const progress = Math.round((index + 1) / WIZARD_STEPS.length * 100);
    return `<div class="wizard-panel-heading"><div><p class="eyebrow">GUIA OPCIONAL DE CRIAÇÃO</p><h2>${escapeHtml(step.title)}</h2><p>${escapeHtml(step.description)}</p></div><span class="wizard-counter">Etapa ${index + 1} de ${WIZARD_STEPS.length}</span></div><div class="wizard-progress" role="progressbar" aria-label="Progresso do guia de criação" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><span style="width:${progress}%"></span></div><p class="wizard-save-note">Preencha o que souber. Você pode pular etapas e continuar depois; a ficha salva automaticamente.</p>`;
  }

  function renderWizardFooter(index) {
    const lastStep = index === WIZARD_STEPS.length - 1;
    return `<button class="button button-outline" type="button" data-wizard-action="previous"${index === 0 ? ' disabled' : ''}>← Voltar</button><div class="wizard-footer-actions"><button class="button button-quiet" type="button" data-wizard-action="free">Preencher livremente</button>${lastStep ? '' : '<button class="button button-outline" type="button" data-wizard-action="skip">Pular etapa</button>'}<button class="button button-primary" type="button" data-wizard-action="next">${lastStep ? 'Concluir guia' : 'Continuar →'}</button></div>`;
  }

  async function moveWizard(step) {
    if (!state.activeCharacter || state.wizardCharacterId !== state.activeCharacter.id) return;
    await flushSave();
    state.wizardStep = Math.max(0, Math.min(WIZARD_STEPS.length - 1, step));
    state.activeTab = WIZARD_STEPS[state.wizardStep].tab;
    renderEditor();
    $('#characterEditor').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function exitWizard() {
    if (!state.activeCharacter || state.wizardCharacterId !== state.activeCharacter.id) return;
    await flushSave();
    state.wizardCharacterId = null;
    state.wizardStep = 0;
    renderEditor();
    toast('Guia encerrado. Continue editando pelas abas da ficha.');
  }

  function renderTab(character, tab) {
    if (tab === 'essentials') return renderEssentials(character);
    if (tab === 'combat') return renderCombat(character);
    if (tab === 'skills') return renderSkills(character);
    if (tab === 'story') return renderStory(character);
    if (tab === 'inventory') return renderInventory(character);
    return renderSpells(character);
  }

  function renderEssentials(character) {
    const i = character.identity;
    const system = i.system || 'other';
    const systemOptions = [
      { value: 'revised-2024', label: 'D&D 5e revisada (2024)' },
      { value: '2014', label: 'D&D 5e (2014)' },
      { value: 'other', label: 'Outra / decidir depois' }
    ];
    const className = matchingOption(CLASS_OPTIONS, choiceValue(i, 'class'))?.value || choiceValue(i, 'class');
    const editionSubclasses = SUBCLASS_OPTIONS[system] || {};
    const subclassValues = system === 'other'
      ? [...(SUBCLASS_OPTIONS['2014']?.[className] || []), ...(SUBCLASS_OPTIONS['revised-2024']?.[className] || [])]
      : editionSubclasses[className] || [];
    const subclassOptions = [...new Set(subclassValues)].map(value => ({ value, label: value }));
    const speciesOptions = (SPECIES_OPTIONS[system] || SPECIES_OPTIONS.other).map(value => ({ value, label: value }));
    const backgroundOptions = (BACKGROUND_OPTIONS[system] || BACKGROUND_OPTIONS.other).map(value => ({ value, label: value }));
    const identity = `<div class="form-grid">
      ${field('Nome do personagem', 'identity.characterName', i.characterName, { span: 'span-2', placeholder: 'Como o grupo o conhece?' })}
      ${field('Jogador', 'identity.player', i.player, { placeholder: 'Seu nome' })}
      ${selectField('Livro de regras', 'identity.system', i.system, systemOptions, 'span-2', true)}
      ${selectWithOther('Classe', 'identity.class', i.class, CLASS_OPTIONS, 'identity.classCustom')}
      ${selectWithOther('Subclasse', 'identity.subclass', i.subclass, subclassOptions, 'identity.subclassCustom')}
      ${selectWithOther('Espécie / raça', 'identity.species', i.species, speciesOptions, 'identity.speciesCustom')}
      ${selectWithOther('Antecedente', 'identity.background', i.background, backgroundOptions, 'identity.backgroundCustom')}
      ${selectWithOther('Tendência', 'identity.alignment', i.alignment, ALIGNMENT_OPTIONS, 'identity.alignmentCustom')}
      ${field('Pontos de experiência (XP total)', 'identity.experience', i.experience, { type: 'number', min: 0, hint: 'Atualize o total acumulado; o nível será calculado automaticamente.' })}
      ${levelProgressField(i.experience)}
    </div>`;
    const abilities = `<div class="ability-grid">${ABILITIES.map(ability => `<div class="ability-card"><label for="ability-${ability.key}">${ability.label}</label><input id="ability-${ability.key}" type="number" min="1" max="30" data-ability-score="${ability.key}" value="${escapeHtml(character.abilities[ability.key])}" aria-label="Valor de ${ability.long}" /><output class="ability-mod" data-mod-output="${ability.key}">+0</output></div>`).join('')}</div><p class="ability-note">O modificador é calculado a partir do valor do atributo.</p>`;
    const avatar = `<section class="form-section avatar-section"><div class="avatar-preview">${safeAvatar(character.avatarDataUrl) ? `<img src="${safeAvatar(character.avatarDataUrl)}" alt="Avatar de ${escapeHtml(i.characterName || 'personagem')}" />` : `<span class="avatar-placeholder">${escapeHtml((i.characterName || '?').trim().charAt(0).toUpperCase() || '?')}</span>`}</div><div class="avatar-copy"><p class="eyebrow">RETRATO DO PERSONAGEM</p><h2>Escolha um avatar</h2><p>A imagem aparece na ficha e na lista de personagens. Ela é reduzida e salva neste navegador.</p><div class="avatar-actions"><button class="button button-outline" id="chooseAvatarButton" type="button">Adicionar imagem</button><button class="button button-quiet" id="removeAvatarButton" type="button"${safeAvatar(character.avatarDataUrl) ? '' : ' disabled'}>Remover</button><input id="avatarFileInput" type="file" accept="image/png,image/jpeg,image/webp" hidden /></div><small>PNG, JPG ou WebP · até 8 MB</small></div></section>`;
    return `${avatar}${section('Identidade', 'Informações principais do personagem.', identity)}${section('Atributos', 'Preencha os valores da sua ficha. Os modificadores são calculados automaticamente.', abilities)}<div class="character-banner"><div><strong>Seu personagem, seu caminho.</strong><small>Você pode salvar uma ficha incompleta e continuar depois.</small></div><span class="computed-chip">Bônus de proficiência <strong data-proficiency>+2</strong></span></div>`;
  }

  async function createAvatarDataUrl(file) {
    if (!file.type.match(/^image\/(png|jpeg|webp)$/)) throw new Error('Escolha uma imagem PNG, JPG ou WebP.');
    if (file.size > 8 * 1024 * 1024) throw new Error('A imagem precisa ter até 8 MB.');
    let bitmap;
    if (window.createImageBitmap) {
      bitmap = await createImageBitmap(file);
    } else {
      bitmap = await new Promise((resolve, reject) => {
        const image = new Image();
        const objectUrl = URL.createObjectURL(file);
        image.onload = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(image);
        };
        image.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Não foi possível abrir essa imagem.'));
        };
        image.src = objectUrl;
      });
    }
    const scale = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('O navegador não conseguiu preparar essa imagem.');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    return canvas.toDataURL('image/webp', 0.82);
  }

  function renderCombat(character) {
    const c = character.combat;
    const maxHp = Math.max(0, Number(c.hpMax) || 0);
    const currentHp = Math.max(0, Number(c.hpCurrent) || 0);
    const hpPercent = maxHp > 0 ? Math.min(100, Math.round(currentHp / maxHp * 100)) : 0;
    const hpState = maxHp > 0 && hpPercent <= 25 ? ' critical' : maxHp > 0 && hpPercent <= 50 ? ' wounded' : '';
    const hpCaption = maxHp <= 0 ? 'Defina os PV máximos' : currentHp <= 0 ? 'Sem pontos de vida' : `${hpPercent}% dos pontos de vida`;
    const stats = `<div class="combat-strip">
      <div class="combat-stat hp-stat${hpState}" data-health-stat>
        <div class="hp-stat-heading"><span>Pontos de vida</span><small data-hp-temp>${Number(c.hpTemp) > 0 ? `+${escapeHtml(c.hpTemp)} temporários` : 'PV atuais / máximos'}</small></div>
        <strong class="hp-total"><span data-combat-summary="hpCurrent">${escapeHtml(c.hpCurrent)}</span><small> / </small><span data-combat-summary="hpMax">${escapeHtml(c.hpMax)}</span><small> PV</small></strong>
        <div class="hp-bar-track" role="progressbar" aria-label="Pontos de vida" aria-valuemin="0" aria-valuemax="${maxHp}" aria-valuenow="${Math.min(maxHp, currentHp)}" aria-valuetext="${currentHp} de ${maxHp} pontos de vida"><div class="hp-bar-fill" data-hp-bar style="width: ${hpPercent}%"></div></div>
        <small class="hp-caption" data-hp-caption>${hpCaption}</small>
      </div>
      <div class="combat-stat"><span>Classe de armadura</span><strong data-combat-summary="armorClass">${escapeHtml(c.armorClass)}</strong><small>CA</small></div>
      <div class="combat-stat"><span>Iniciativa</span><strong data-initiative>+0</strong><small>ajuste incluído</small></div>
      <div class="combat-stat"><span>Deslocamento</span><strong data-combat-summary="speed">${escapeHtml(c.speed)}</strong><small>pés</small></div>
    </div>`;
    const combatFields = `<div class="form-grid four combat-input-grid">
      ${field('PV máximos', 'combat.hpMax', c.hpMax, { type: 'number', min: 0 })}
      ${field('PV atuais', 'combat.hpCurrent', c.hpCurrent, { type: 'number', min: 0 })}
      ${field('PV temporários', 'combat.hpTemp', c.hpTemp, { type: 'number', min: 0 })}
      ${field('Classe de armadura', 'combat.armorClass', c.armorClass, { type: 'number', min: 0 })}
      ${field('Ajuste de iniciativa', 'combat.initiativeAdjustment', c.initiativeAdjustment, { type: 'number', min: -20, max: 20, hint: 'Somado ao modificador de Destreza.' })}
      ${field('Deslocamento (pés)', 'combat.speed', c.speed, { type: 'number', min: 0 })}
      ${field('Dados de vida', 'combat.hitDice', c.hitDice, { placeholder: 'Ex.: 3d8' })}
      <label class="field inspiration-field"><span>Inspiração</span><span class="toggle-line"><input type="checkbox" data-path="combat.inspiration"${c.inspiration ? ' checked' : ''} /> Marcar inspiração</span></label>
    </div>`;
    const death = `<div class="death-save-row">
      <div class="death-save-group"><strong>Salvaguardas contra a morte</strong></div>
      <div class="death-save-group">Sucessos <span class="death-save-boxes">${[1, 2, 3].map(index => `<input type="checkbox" data-death-save="success" data-index="${index}"${Number(c.deathSuccess) >= index ? ' checked' : ''} aria-label="Sucesso ${index}" />`).join('')}</span></div>
      <div class="death-save-group">Falhas <span class="death-save-boxes">${[1, 2, 3].map(index => `<input type="checkbox" data-death-save="failure" data-index="${index}"${Number(c.deathFailure) >= index ? ' checked' : ''} aria-label="Falha ${index}" />`).join('')}</span></div>
    </div>`;
    const attacks = `<div class="attack-list" id="attackList">${character.attacks.map(attack => attackRow(attack)).join('')}</div><button class="add-row" id="addAttackButton" type="button">＋ Adicionar ataque</button><p class="editor-help">Os campos de ataque são livres para acomodar armas, magias e habilidades. Consulte a edição escolhida para os detalhes de cada regra.</p>`;
    return `${section('Resumo de combate', 'Valores para consultar rapidamente durante uma cena.', stats)}${section('Recursos', 'Pontos de vida, deslocamento e outros valores da ficha.', combatFields)}${section('Salvaguardas contra a morte', 'Marque cada sucesso ou falha durante a cena.', death)}${section('Ataques e ações', 'Anote ataques e ações que queira encontrar com rapidez.', attacks)}`;
  }

  function attackRow(attack) {
    return `<div class="attack-row" data-attack-id="${escapeHtml(attack.id)}">
      <input class="sheet-input" type="text" data-attack-prop="name" value="${escapeHtml(attack.name)}" placeholder="Nome" aria-label="Nome do ataque" />
      <input class="sheet-input" type="text" data-attack-prop="bonus" value="${escapeHtml(attack.bonus)}" placeholder="Bônus" aria-label="Bônus do ataque" />
      <input class="sheet-input" type="text" data-attack-prop="damage" value="${escapeHtml(attack.damage)}" placeholder="Dano / tipo" aria-label="Dano e tipo" />
      <input class="sheet-input" type="text" data-attack-prop="notes" value="${escapeHtml(attack.notes)}" placeholder="Alcance / notas" aria-label="Alcance ou notas do ataque" />
      <button class="attack-remove" type="button" data-remove-attack="${escapeHtml(attack.id)}" aria-label="Remover ataque">×</button>
    </div>`;
  }

  function renderSkills(character) {
    const perception = character.skills['Percepção'] || { proficient: false, expertise: false };
    const perceptionMultiplier = perception.expertise ? 2 : perception.proficient ? 1 : 0;
    const passivePerception = 10 + abilityModifier(character.abilities.wis) + proficiencyBonus(character.identity.level) * perceptionMultiplier;
    const saveRows = ABILITIES.map(ability => {
      const proficient = Boolean(character.savingThrows[ability.key]);
      return `<label class="toggle-line"><input type="checkbox" data-saving-throw="${ability.key}"${proficient ? ' checked' : ''} /><span>${ability.long}</span><output data-saving-total="${ability.key}">${signed(abilityModifier(character.abilities[ability.key]) + (proficient ? proficiencyBonus(character.identity.level) : 0))}</output></label>`;
    }).join('');
    const skillRows = SKILLS.map(([name, abilityKey]) => {
      const skill = character.skills[name] || { proficient: false, expertise: false };
      return `<div class="skill-row" data-skill-row="${escapeHtml(name)}"><span class="skill-ability">${ABILITIES.find(item => item.key === abilityKey).label}</span><strong>${escapeHtml(name)}</strong><label class="check-cell"><input type="checkbox" data-skill-proficient="${escapeHtml(name)}"${skill.proficient ? ' checked' : ''} /> Prof.</label><label class="check-cell"><input type="checkbox" data-skill-expertise="${escapeHtml(name)}"${skill.expertise ? ' checked' : ''} /> Exp.</label><output class="skill-total" data-skill-total="${escapeHtml(name)}">+0</output></div>`;
    }).join('');
    const senses = `<div class="perception-summary"><span>Sabedoria passiva (Percepção)</span><strong data-passive-perception>${passivePerception}</strong><small>10 + bônus de Percepção</small></div>`;
    return `${section('Salvaguardas', 'Marque as salvaguardas em que o personagem é proficiente.', `<div class="save-checks">${saveRows}</div>`)}${section('Perícias', 'Marque proficiência ou especialização. Os totais usam o atributo e o bônus de proficiência.', `<div class="skill-list-head"><span></span><span>Perícia</span><span></span><span></span><span>Total</span></div><div class="skill-list">${skillRows}</div>`)}${section('Sentidos', 'A Percepção passiva é calculada com Sabedoria e as proficiências marcadas acima.', senses)}${section('Idiomas e outras proficiências', 'Anote idiomas, armas, armaduras, ferramentas e outros treinamentos.', textareaField('Idiomas e proficiências', 'proficienciesLanguages', character.proficienciesLanguages, { placeholder: 'Ex.: comum, élfico, armas marciais, ferramentas de ladrão…', tall: true }))}`;
  }

  function renderStory(character) {
    const appearance = character.appearance;
    const story = character.story;
    const physicalDetails = `<div class="form-grid four">
      ${field('Idade', 'appearance.age', appearance.age, { placeholder: 'Ex.: 28' })}
      ${field('Altura', 'appearance.height', appearance.height, { placeholder: 'Ex.: 1,75 m' })}
      ${field('Peso', 'appearance.weight', appearance.weight, { placeholder: 'Opcional' })}
      ${field('Olhos', 'appearance.eyes', appearance.eyes)}
      ${field('Pele', 'appearance.skin', appearance.skin)}
      ${field('Cabelos', 'appearance.hair', appearance.hair)}
    </div>${textareaField('Descrição da aparência', 'appearance.description', appearance.description, { placeholder: 'Descreva roupas, marcas, postura ou outros detalhes visuais…' })}`;
    const characterTraits = `<div class="form-grid two">
      ${textareaField('Traços de personalidade', 'story.personalityTraits', story.personalityTraits, { placeholder: 'Como costuma agir?' })}
      ${textareaField('Ideais', 'story.ideals', story.ideals, { placeholder: 'O que considera importante?' })}
      ${textareaField('Vínculos', 'story.bonds', story.bonds, { placeholder: 'Com quem ou com o que se importa?' })}
      ${textareaField('Defeitos', 'story.flaws', story.flaws, { placeholder: 'Que fraquezas ou tentações carrega?' })}
    </div>`;
    const narrative = `<div class="form-grid two">
      ${textareaField('História do personagem', 'story.backstory', story.backstory, { placeholder: 'De onde veio? O que aconteceu antes da aventura?', tall: true })}
      ${textareaField('Aliados e organizações', 'story.allies', story.allies, { placeholder: 'Pessoas, grupos ou organizações importantes…', tall: true })}
      ${field('Símbolo ou emblema', 'story.symbol', story.symbol, { placeholder: 'Descreva um símbolo importante' })}
      ${textareaField('Tesouro', 'story.treasure', story.treasure, { placeholder: 'Relíquias, objetos especiais ou tesouros narrativos…' })}
      ${textareaField('Características e habilidades', 'features', character.features, { placeholder: 'Anote traços, talentos e habilidades que queira consultar.', span: 'span-2', tall: true })}
    </div>`;
    return `${section('Aparência do personagem', 'Detalhes físicos para ajudar a imaginar o personagem.', physicalDetails)}${section('Personalidade', 'Traços, ideais, vínculos e defeitos que guiam suas escolhas.', characterTraits)}${section('História e detalhes', 'Registre o passado e os elementos importantes da jornada.', narrative)}`;
  }

  function renderInventory(character) {
    const inv = character.inventory;
    const coinLabels = [
      ['copper', 'PC'], ['silver', 'PP'], ['electrum', 'PE'], ['gold', 'PO'], ['platinum', 'PL']
    ];
    const coins = `<div class="resource-row">${coinLabels.map(([key, label]) => `<label class="resource-pill"><span>${label}</span><input type="number" min="0" data-path="inventory.${key}" value="${escapeHtml(inv[key])}" aria-label="Quantidade de ${label}" /></label>`).join('')}</div>`;
    return `${section('Equipamento e itens', 'Anote o que o personagem carrega e o que precisa acompanhar.', textareaField('Inventário', 'inventory.equipment', inv.equipment, { placeholder: 'Armas, armaduras, ferramentas, objetos importantes…', tall: true }))}${section('Moedas', 'Registre as moedas que o personagem possui.', coins)}${section('Espaço para a mesa', 'Se sua campanha usa cargas ou limites especiais, anote aqui.', textareaField('Observações de inventário', 'inventory.notes', inv.notes || '', { placeholder: 'Itens emprestados, tesouros do grupo, carga…' }))}`;
  }

  function renderSpells(character) {
    const casting = character.spellcasting;
    const abilityOptions = [{ value: '', label: 'Selecione…' }, ...ABILITIES.map(ability => ({ value: ability.key, label: ability.long }))];
    const castingFields = `<div class="form-grid four">
      ${field('Classe conjuradora', 'spellcasting.className', casting.className, { placeholder: 'Ex.: mago' })}
      ${selectField('Habilidade-chave', 'spellcasting.ability', casting.ability, abilityOptions)}
      ${field('CD para resistir', 'spellcasting.spellSaveDC', casting.spellSaveDC, { type: 'number', min: 0 })}
      ${field('Bônus de ataque mágico', 'spellcasting.attackBonus', casting.attackBonus, { type: 'number', min: -20, max: 30 })}
    </div>`;
    const slotCards = Array.from({ length: 9 }, (_, index) => {
      const level = String(index + 1);
      const slot = character.spellSlots[level];
      return `<div class="spell-slot-card"><h3>Nível ${level}</h3><div class="spell-slot-fields">${field('Total', `spellSlots.${level}.total`, slot.total, { type: 'number', min: 0 })}${field('Usados', `spellSlots.${level}.used`, slot.used, { type: 'number', min: 0 })}</div><small><output data-slot-remaining="${level}">${Math.max(0, Number(slot.total) - Number(slot.used))}</output> disponíveis</small></div>`;
    }).join('');
    const spellLevels = Array.from({ length: 10 }, (_, level) => {
      const title = level === 0 ? 'Truques' : `Nível ${level}`;
      const open = level === 0 ? ' open' : '';
      return `<details class="spell-level"${open}><summary><span>${title}</span><small>Magias conhecidas ou preparadas</small></summary>${textareaField('Uma magia por linha; marque as preparadas com ✓', `spellLists.${level}`, character.spellLists[String(level)], { tall: true })}</details>`;
    }).join('');
    return `${section('Conjuração', 'Campos inspirados pela área de conjuração da ficha de referência.', castingFields)}${section('Espaços de magia', 'Registre espaços totais e usados para cada círculo.', `<div class="spell-slot-grid">${slotCards}</div>`)}${section('Magias por nível', 'Abra cada nível para anotar as magias. As listas são salvas automaticamente.', `<div class="spell-level-list">${spellLevels}</div>`)}${section('Notas de magia e aventura', 'Notas livres para efeitos, componentes, pistas ou lembretes.', `${textareaField('Anotações de magia', 'spells', character.spells, { placeholder: 'Alcance, componentes, duração e lembretes…', tall: true })}${textareaField('Diário da aventura', 'notes', character.notes, { placeholder: 'O que aconteceu? Quem conhecemos? O que queremos fazer depois?', tall: true })}`)}`;
  }

  function setNestedValue(object, path, value) {
    const keys = path.split('.');
    const last = keys.pop();
    const target = keys.reduce((current, key) => current[key], object);
    target[last] = value;
  }

  function updateComputed() {
    const character = state.activeCharacter;
    if (!character) return;
    character.identity.level = levelForExperience(character.identity.experience);
    character.identity.levelAuto = true;
    const progress = experienceProgress(character.identity.experience);
    const levelOutput = $('[data-level-output]');
    if (levelOutput) levelOutput.textContent = String(progress.level);
    const xpProgress = $('[data-xp-progress]');
    const xpProgressTrack = xpProgress?.parentElement;
    if (xpProgress && xpProgressTrack) {
      xpProgress.style.width = `${progress.percent}%`;
      xpProgressTrack.setAttribute('aria-valuenow', String(progress.percent));
      xpProgressTrack.setAttribute('aria-valuetext', progress.message);
    }
    const xpGuidance = $('[data-xp-guidance]');
    if (xpGuidance) xpGuidance.textContent = progress.message;
    $$('[data-mod-output]').forEach(output => {
      output.textContent = signed(abilityModifier(character.abilities[output.dataset.modOutput]));
    });
    const proficiency = proficiencyBonus(character.identity.level);
    const proficiencyOutput = $('[data-proficiency]');
    if (proficiencyOutput) proficiencyOutput.textContent = signed(proficiency);
    $$('[data-saving-total]').forEach(output => {
      const key = output.dataset.savingTotal;
      output.textContent = signed(abilityModifier(character.abilities[key]) + (character.savingThrows[key] ? proficiency : 0));
    });
    $$('[data-skill-total]').forEach(output => {
      const name = output.dataset.skillTotal;
      const skill = character.skills[name] || { proficient: false, expertise: false };
      const abilityKey = SKILLS.find(item => item[0] === name)?.[1];
      if (!abilityKey) return;
      const multiplier = skill.expertise ? 2 : skill.proficient ? 1 : 0;
      output.textContent = signed(abilityModifier(character.abilities[abilityKey]) + proficiency * multiplier);
    });
    const perception = character.skills['Percepção'] || { proficient: false, expertise: false };
    const perceptionMultiplier = perception.expertise ? 2 : perception.proficient ? 1 : 0;
    const passivePerception = 10 + abilityModifier(character.abilities.wis) + proficiency * perceptionMultiplier;
    const passivePerceptionOutput = $('[data-passive-perception]');
    if (passivePerceptionOutput) passivePerceptionOutput.textContent = String(passivePerception);
    $$('[data-slot-remaining]').forEach(output => {
      const slot = character.spellSlots[output.dataset.slotRemaining] || { total: 0, used: 0 };
      output.textContent = String(Math.max(0, Number(slot.total) - Number(slot.used)));
    });
    const initiative = $('[data-initiative]');
    if (initiative) initiative.textContent = signed(abilityModifier(character.abilities.dex) + (Number(character.combat.initiativeAdjustment) || 0));
    $$('[data-combat-summary]').forEach(output => {
      output.textContent = character.combat[output.dataset.combatSummary] ?? 0;
    });
    const maxHp = Math.max(0, Number(character.combat.hpMax) || 0);
    const currentHp = Math.max(0, Number(character.combat.hpCurrent) || 0);
    const hpPercent = maxHp > 0 ? Math.min(100, Math.round(currentHp / maxHp * 100)) : 0;
    const hpBar = $('[data-hp-bar]');
    const hpTrack = hpBar?.parentElement;
    const hpCard = $('[data-health-stat]');
    if (hpBar && hpTrack && hpCard) {
      hpBar.style.width = `${hpPercent}%`;
      hpTrack.setAttribute('aria-valuemax', String(maxHp));
      hpTrack.setAttribute('aria-valuenow', String(Math.min(maxHp, currentHp)));
      hpTrack.setAttribute('aria-valuetext', `${currentHp} de ${maxHp} pontos de vida`);
      hpCard.classList.toggle('critical', maxHp > 0 && hpPercent <= 25);
      hpCard.classList.toggle('wounded', maxHp > 0 && hpPercent > 25 && hpPercent <= 50);
      const caption = $('[data-hp-caption]');
      if (caption) caption.textContent = maxHp <= 0 ? 'Defina os PV máximos' : currentHp <= 0 ? 'Sem pontos de vida' : `${hpPercent}% dos pontos de vida`;
      const temp = $('[data-hp-temp]');
      if (temp) temp.textContent = Number(character.combat.hpTemp) > 0 ? `+${character.combat.hpTemp} temporários` : 'PV atuais / máximos';
    }
    const mobileHpText = `${currentHp} / ${maxHp} PV`;
    const mobileName = choiceValue(character.identity, 'characterName') || 'Personagem';
    const mobileClass = [choiceValue(character.identity, 'species'), choiceValue(character.identity, 'class')].filter(Boolean).join(' · ') || 'Personagem em criação';
    const setMobileText = (selector, value) => {
      const target = $(selector);
      if (target) target.textContent = String(value);
    };
    setMobileText('[data-mobile-name]', mobileName);
    setMobileText('[data-mobile-class]', mobileClass);
    setMobileText('[data-mobile-level]', character.identity.level);
    setMobileText('[data-mobile-xp]', formatXP(character.identity.experience));
    setMobileText('[data-mobile-hp]', mobileHpText);
    setMobileText('[data-mobile-hp-detail]', mobileHpText);
    setMobileText('[data-mobile-ac]', character.combat.armorClass);
    setMobileText('[data-mobile-ac-detail]', character.combat.armorClass);
    setMobileText('[data-mobile-initiative]', signed(abilityModifier(character.abilities.dex) + (Number(character.combat.initiativeAdjustment) || 0)));
    setMobileText('[data-mobile-speed]', character.combat.speed);
    setMobileText('[data-mobile-proficiency]', signed(proficiency));
    const mobileBar = $('[data-mobile-hp-bar]');
    const mobileDetailBar = $('[data-mobile-hp-detail-bar]');
    if (mobileBar) mobileBar.style.width = `${hpPercent}%`;
    if (mobileDetailBar) {
      mobileDetailBar.style.width = `${hpPercent}%`;
      const track = mobileDetailBar.parentElement;
      track?.setAttribute('aria-valuemax', String(maxHp));
      track?.setAttribute('aria-valuenow', String(Math.min(maxHp, currentHp)));
      track?.setAttribute('aria-valuetext', `${currentHp} de ${maxHp} pontos de vida`);
    }
    $('#editorTitle').textContent = character.identity.characterName || 'Novo personagem';
    $('#breadcrumbName').textContent = character.identity.characterName || 'Novo personagem';
    $('#editorSubtitle').textContent = [choiceValue(character.identity, 'species'), choiceValue(character.identity, 'class'), character.identity.level ? `Nível ${character.identity.level}` : ''].filter(Boolean).join(' · ') || 'Preencha o que souber; você pode voltar e editar depois.';
  }

  function scheduleSave() {
    if (!state.activeCharacter) return;
    const status = $('#saveStatus');
    status.classList.remove('error');
    status.classList.add('saving');
    status.innerHTML = '<span class="status-dot"></span> Salvando…';
    clearTimeout(state.saveTimer);
    state.saveTimer = setTimeout(() => { flushSave(); }, 450);
  }

  async function flushSave() {
    clearTimeout(state.saveTimer);
    if (!state.activeCharacter || !state.db) return;
    const snapshot = structuredClone(state.activeCharacter);
    snapshot.updatedAt = new Date().toISOString();
    state.activeCharacter.updatedAt = snapshot.updatedAt;
    state.saveQueue = state.saveQueue.catch(() => {}).then(() => dbRequest('characters', 'readwrite', store => store.put(snapshot)));
    try {
      await state.saveQueue;
      const index = state.characters.findIndex(character => character.id === snapshot.id);
      if (index !== -1) state.characters[index] = snapshot;
      if (state.activeCharacter?.id === snapshot.id) {
        $('#saveStatus').classList.remove('saving', 'error');
        $('#saveStatus').innerHTML = '<span class="status-dot"></span> Salvo automaticamente';
      }
      renderSidebar();
      if (!$('#dashboard').hidden) renderDashboard();
    } catch (error) {
      $('#saveStatus').classList.remove('saving');
      $('#saveStatus').classList.add('error');
      $('#saveStatus').innerHTML = '<span class="status-dot"></span> Não foi possível salvar';
      toast(error.message || 'Falha ao salvar no navegador.', true);
    }
  }

  function handleEditorInput(event) {
    const target = event.target;
    const character = state.activeCharacter;
    if (!character) return;
    if (target.dataset.path) {
      let value = target.type === 'checkbox' ? target.checked : target.value;
      if (target.type === 'number') value = target.value === '' ? 0 : Number(target.value);
      const previousValue = target.dataset.path === 'identity.class' ? character.identity.class : undefined;
      setNestedValue(character, target.dataset.path, value);
      if (target.dataset.customPath && value !== CUSTOM_OPTION) setNestedValue(character, target.dataset.customPath, '');
      if (target.dataset.customValueFor) setNestedValue(character, target.dataset.customValueFor, CUSTOM_OPTION);
      if (target.dataset.path === 'identity.class' && previousValue !== value) {
        character.identity.subclass = '';
        character.identity.subclassCustom = '';
      }
    }
    if (target.dataset.abilityScore) {
      character.abilities[target.dataset.abilityScore] = target.value === '' ? 0 : Number(target.value);
    }
    if (target.dataset.savingThrow) {
      character.savingThrows[target.dataset.savingThrow] = target.checked;
    }
    if (target.dataset.skillProficient || target.dataset.skillExpertise) {
      const name = target.dataset.skillProficient || target.dataset.skillExpertise;
      character.skills[name] ||= { proficient: false, expertise: false };
      if (target.dataset.skillProficient) character.skills[name].proficient = target.checked;
      if (target.dataset.skillExpertise) character.skills[name].expertise = target.checked;
    }
    if (target.dataset.deathSave) {
      const type = target.dataset.deathSave === 'success' ? 'deathSuccess' : 'deathFailure';
      const box = Number(target.dataset.index);
      const checkedBoxes = $$(`[data-death-save="${target.dataset.deathSave}"]:checked`).map(input => Number(input.dataset.index));
      character.combat[type] = checkedBoxes.length ? Math.max(...checkedBoxes) : 0;
      $$(`[data-death-save="${target.dataset.deathSave}"]`).forEach(input => {
        input.checked = Number(input.dataset.index) <= character.combat[type];
      });
      void box;
    }
    const attackRowElement = target.closest('[data-attack-id]');
    if (attackRowElement && target.dataset.attackProp) {
      const attack = character.attacks.find(item => item.id === attackRowElement.dataset.attackId);
      if (attack) attack[target.dataset.attackProp] = target.value;
    }
    const refreshSelect = target.dataset.refreshSelect === 'true' && event.type === 'change';
    if (refreshSelect) renderEditor();
    updateComputed();
    scheduleSave();
  }

  async function switchTab(tab) {
    if (tab === state.activeTab) return;
    await flushSave();
    state.activeTab = tab;
    renderEditor();
  }

  async function deleteCharacter() {
    const character = state.activeCharacter;
    if (!character) return;
    const name = character.identity.characterName || 'esta ficha';
    if (!window.confirm(`Excluir “${name}” deste navegador? Esta ação não pode ser desfeita sem um backup.`)) return;
    await dbRequest('characters', 'readwrite', store => store.delete(character.id));
    state.characters = state.characters.filter(item => item.id !== character.id);
    if (state.wizardCharacterId === character.id) state.wizardCharacterId = null;
    state.activeCharacter = null;
    renderDashboard();
    toast('Ficha excluída deste navegador.');
  }

  function toast(message, isError = false) {
    toastBox.textContent = message;
    toastBox.classList.toggle('error', isError);
    toastBox.classList.add('visible');
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => toastBox.classList.remove('visible'), 3200);
  }

  async function exportBackup() {
    if (!state.characters.length) {
      toast('Ainda não há fichas para exportar.');
      return;
    }
    await flushSave();
    const payload = {
      format: 'ficha-de-aventura-backup',
      version: 1,
      exportedAt: new Date().toISOString(),
      characters: state.characters.map(character => {
        const copy = structuredClone(character);
        delete copy.ownerId;
        return copy;
      })
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fichas-${state.user.username}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast('Backup das fichas baixado. Guarde o arquivo em um lugar seguro.');
  }

  function preparePrintableFields(root) {
    root.querySelectorAll('.field').forEach(fieldElement => {
      const valueControls = Array.from(fieldElement.querySelectorAll('input:not([type="checkbox"]):not([type="file"]), textarea, select'));
      if (!valueControls.length) return;
      const hasValue = valueControls.some(control => {
        if (control.tagName === 'SELECT') return control.value !== '';
        return String(control.value || '').trim() !== '';
      });
      if (!hasValue && !fieldElement.querySelector('input[type="checkbox"]') && !fieldElement.querySelector('output')) fieldElement.remove();
    });

    root.querySelectorAll('input[type="file"]').forEach(control => control.remove());
    root.querySelectorAll('input[type="checkbox"]').forEach(control => {
      const mark = document.createElement('span');
      mark.className = `print-check${control.checked ? ' checked' : ''}`;
      mark.textContent = control.checked ? '☑' : '☐';
      mark.setAttribute('aria-label', control.checked ? 'Marcado' : 'Não marcado');
      control.replaceWith(mark);
    });
    root.querySelectorAll('input, textarea, select').forEach(control => {
      const value = control.tagName === 'SELECT'
        ? control.selectedOptions[0]?.textContent?.trim() || ''
        : String(control.value || '').trim();
      if (!value) {
        control.remove();
        return;
      }
      const printed = document.createElement('span');
      printed.className = `print-value${control.tagName === 'TEXTAREA' ? ' multiline' : ''}`;
      printed.textContent = value;
      control.replaceWith(printed);
    });
    root.querySelectorAll('button, .editor-help, .ability-note').forEach(element => element.remove());
    root.querySelectorAll('.attack-row').forEach(row => {
      if (!Array.from(row.querySelectorAll('.print-value')).some(value => value.textContent.trim())) row.remove();
    });
    root.querySelectorAll('.spell-level').forEach(level => {
      if (!level.querySelector('.print-value')) level.remove();
    });
  }

  function updatePrintableComputed(root, character) {
    const level = character.identity.level;
    const proficiency = proficiencyBonus(level);
    root.querySelectorAll('[data-mod-output]').forEach(output => {
      output.textContent = signed(abilityModifier(character.abilities[output.dataset.modOutput]));
    });
    const proficiencyOutput = root.querySelector('[data-proficiency]');
    if (proficiencyOutput) proficiencyOutput.textContent = signed(proficiency);
    root.querySelectorAll('[data-saving-total]').forEach(output => {
      const key = output.dataset.savingTotal;
      output.textContent = signed(abilityModifier(character.abilities[key]) + (character.savingThrows[key] ? proficiency : 0));
    });
    root.querySelectorAll('[data-skill-total]').forEach(output => {
      const name = output.dataset.skillTotal;
      const skill = character.skills[name] || { proficient: false, expertise: false };
      const abilityKey = SKILLS.find(item => item[0] === name)?.[1];
      if (!abilityKey) return;
      const multiplier = skill.expertise ? 2 : skill.proficient ? 1 : 0;
      output.textContent = signed(abilityModifier(character.abilities[abilityKey]) + proficiency * multiplier);
    });
    const perception = character.skills['Percepção'] || { proficient: false, expertise: false };
    const perceptionMultiplier = perception.expertise ? 2 : perception.proficient ? 1 : 0;
    const passivePerception = 10 + abilityModifier(character.abilities.wis) + proficiency * perceptionMultiplier;
    const perceptionOutput = root.querySelector('[data-passive-perception]');
    if (perceptionOutput) perceptionOutput.textContent = String(passivePerception);
    const initiative = root.querySelector('[data-initiative]');
    if (initiative) initiative.textContent = signed(abilityModifier(character.abilities.dex) + (Number(character.combat.initiativeAdjustment) || 0));
  }

  async function exportCharacterPdf() {
    const character = state.activeCharacter;
    if (!character) return;
    await flushSave();
    const root = $('#printSheet');
    const identity = character.identity;
    const name = identity.characterName?.trim() || 'Personagem sem nome';
    const portrait = safeAvatar(character.avatarDataUrl);
    const details = [
      choiceValue(identity, 'species'), choiceValue(identity, 'class'), choiceValue(identity, 'subclass'),
      choiceValue(identity, 'background'), choiceValue(identity, 'alignment'), `Nível ${identity.level}`
    ].filter(Boolean).map(escapeHtml).join(' · ');
    const tabs = [
      ['Visão geral', 'essentials'], ['Combate', 'combat'], ['Perícias', 'skills'],
      ['História', 'story'], ['Inventário', 'inventory'], ['Conjuração', 'spells']
    ];
    const hp = `${Number(character.combat.hpCurrent) || 0} / ${Number(character.combat.hpMax) || 0} PV`;
    root.innerHTML = `<article class="print-sheet-document"><header class="print-header">${portrait ? `<img class="print-portrait" src="${portrait}" alt="" />` : ''}<div class="print-title"><p>FICHA DE AVENTURA · D&D</p><h1>${escapeHtml(name)}</h1><div>${details || 'Personagem em criação'}</div></div></header><div class="print-quick-stats"><div><small>Pontos de vida</small><strong>${escapeHtml(hp)}</strong></div><div><small>Classe de armadura</small><strong>${escapeHtml(character.combat.armorClass)} CA</strong></div><div><small>Iniciativa</small><strong>${escapeHtml(signed(abilityModifier(character.abilities.dex) + (Number(character.combat.initiativeAdjustment) || 0)))}</strong></div><div><small>Experiência</small><strong>${escapeHtml(formatXP(identity.experience))} XP</strong></div></div>${tabs.map(([title, tab]) => `<div class="print-tab"><h2>${title}</h2>${renderTab(character, tab)}</div>`).join('')}<footer class="print-footer">Ficha exportada em ${escapeHtml(new Date().toLocaleDateString('pt-BR'))} · Ficha de Aventura</footer></article>`;
    updatePrintableComputed(root, character);
    preparePrintableFields(root);
    const originalTitle = document.title;
    document.title = `${name} - Ficha de Aventura`;
    const cleanup = () => {
      root.replaceChildren();
      document.title = originalTitle;
    };
    window.addEventListener('afterprint', cleanup, { once: true });
    try {
      toast('Na janela de impressão, escolha “Salvar como PDF”.');
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      window.print();
    } catch (error) {
      window.removeEventListener('afterprint', cleanup);
      cleanup();
      toast(error.message || 'Não foi possível abrir a impressão desta ficha.', true);
    }
  }

  async function importBackup(file) {
    try {
      const content = await file.text();
      const data = JSON.parse(content);
      const entries = Array.isArray(data) ? data : Array.isArray(data.characters) ? data.characters : data.character ? [data.character] : [];
      if (!entries.length) throw new Error('O arquivo não contém fichas reconhecíveis.');
      const imported = [];
      for (const source of entries) {
        if (!source || typeof source !== 'object' || !source.identity) continue;
        const character = normalizeCharacter({ ...source, id: newId(), updatedAt: new Date().toISOString() }, state.user.username, state.user.displayName);
        character.avatarDataUrl = safeAvatar(source.avatarDataUrl);
        imported.push(character);
      }
      if (!imported.length) throw new Error('Não encontrei fichas válidas nesse arquivo.');
      for (const character of imported) {
        await dbRequest('characters', 'readwrite', store => store.add(character));
      }
      state.characters = [...imported, ...state.characters];
      state.activeCharacter = null;
      renderDashboard();
      toast(`${imported.length} ${imported.length === 1 ? 'ficha importada' : 'fichas importadas'} para este perfil.`);
    } catch (error) {
      toast(error.message || 'Não foi possível importar esse backup.', true);
    }
  }

  function bindEvents() {
    $$('.auth-tab').forEach(button => button.addEventListener('click', () => setAuthMode(button.dataset.authMode)));
    authForm.addEventListener('submit', handleAuth);
    $('#logoutButton').addEventListener('click', goToLogin);
    $('#homeLink').addEventListener('click', event => { event.preventDefault(); flushSave().then(renderDashboard); });
    $('#allSheetsButton').addEventListener('click', () => { flushSave().then(renderDashboard); });
    $('#backToDashboard').addEventListener('click', () => { flushSave().then(renderDashboard); });
    ['sidebarNewButton', 'newSheetButton', 'dashboardNewButton', 'emptyNewButton'].forEach(id => $(`#${id}`).addEventListener('click', createCharacter));
    $('#sheetTabs').addEventListener('click', event => {
      const button = event.target.closest('[data-tab]');
      if (button) switchTab(button.dataset.tab);
    });
    $('#wizardFooter').addEventListener('click', event => {
      const action = event.target.closest('[data-wizard-action]')?.dataset.wizardAction;
      if (!action) return;
      if (action === 'free') {
        exitWizard();
      } else if (action === 'previous') {
        moveWizard(state.wizardStep - 1);
      } else if (action === 'skip') {
        moveWizard(state.wizardStep + 1);
      } else if (action === 'next') {
        if (state.wizardStep === WIZARD_STEPS.length - 1) exitWizard();
        else moveWizard(state.wizardStep + 1);
      }
    });
    $('#mobileSummary').addEventListener('toggle', event => {
      $('#mainContent').classList.toggle('mobile-summary-open', event.currentTarget.open);
    });
    editorForm.addEventListener('input', handleEditorInput);
    editorForm.addEventListener('change', handleEditorInput);
    editorForm.addEventListener('click', async event => {
      if (event.target.id === 'chooseAvatarButton') {
        $('#avatarFileInput').click();
      }
      if (event.target.id === 'removeAvatarButton') {
        state.activeCharacter.avatarDataUrl = '';
        renderEditor();
        scheduleSave();
      }
      if (event.target.id === 'addAttackButton') {
        state.activeCharacter.attacks.push({ id: newId(), name: '', bonus: '', damage: '', notes: '' });
        renderEditor();
        scheduleSave();
      }
      const remove = event.target.closest('[data-remove-attack]');
      if (remove) {
        state.activeCharacter.attacks = state.activeCharacter.attacks.filter(attack => attack.id !== remove.dataset.removeAttack);
        renderEditor();
        scheduleSave();
      }
    });
    editorForm.addEventListener('change', async event => {
      if (event.target.id !== 'avatarFileInput') return;
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file) return;
      try {
        state.activeCharacter.avatarDataUrl = await createAvatarDataUrl(file);
        renderEditor();
        scheduleSave();
        toast('Avatar atualizado e salvo nesta ficha.');
      } catch (error) {
        toast(error.message || 'Não foi possível usar essa imagem.', true);
      }
    });
    $('#deleteCharacterButton').addEventListener('click', deleteCharacter);
    $('#exportPdfButton').addEventListener('click', exportCharacterPdf);
    $('#backupButton').addEventListener('click', exportBackup);
    $('#importButton').addEventListener('click', () => $('#importFile').click());
    $('#importFile').addEventListener('change', event => {
      const file = event.target.files?.[0];
      if (file) importBackup(file);
      event.target.value = '';
    });
  }

  async function restoreSession() {
    const username = sessionStorage.getItem(SESSION_KEY);
    if (!username) return;
    const account = await dbRequest('accounts', 'readonly', store => store.get(username));
    if (account) await enterApp(account);
    else sessionStorage.removeItem(SESSION_KEY);
  }

  async function init() {
    bindEvents();
    try {
      if (!('indexedDB' in window)) throw new Error('Este navegador não oferece um banco de dados local compatível.');
      state.db = await openDatabase();
      await restoreSession();
    } catch (error) {
      showAuthMessage(error.message || 'Não foi possível abrir o armazenamento local.');
    }
  }

  init();
})();
