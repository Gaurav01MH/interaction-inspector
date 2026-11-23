export const eventTypes = ['focusin', 'focusout', 'click', 'keydown'] as const;
export type EventType = typeof eventTypes[number];

export const standardTags = new Set([
  'a', 'article', 'body', 'button', 'canvas', 'details', 'dialog', 'div', 'fieldset',
  'form', 'h1', 'h2', 'h3', 'iframe', 'img', 'input', 'label', 'li', 'main', 'nav',
  'ol', 'option', 'p', 'section', 'select', 'span', 'summary', 'svg', 'textarea', 'ul',
]);

const ariaValues = {
  'aria-hidden': ['true', 'false'],
  'aria-disabled': ['true', 'false'],
  'aria-expanded': ['true', 'false'],
  'aria-selected': ['true', 'false'],
  'aria-checked': ['true', 'false', 'mixed'],
  'aria-pressed': ['true', 'false', 'mixed'],
  'aria-current': ['true', 'false', 'page', 'step', 'location', 'date', 'time'],
} as const;

export const labelForTag = (tag: string) => standardTags.has(tag) ? tag : 'element';

export const readAria = (read: (name: string) => string | null) =>
  Object.entries(ariaValues).flatMap(([name, allowed]) => {
    const value = read(name);
    if (value === null) return [];
    return [[name, (allowed as readonly string[]).includes(value) ? value : '(invalid token)']];
  });

export const readTabIndex = (value: string | null) => {
  if (value === null) return '(absent)';
  const trimmed = value.trim();
  if (!/^[+-]?\d+$/.test(trimmed)) return '(invalid integer)';
  const number = Number(trimmed);
  return number === -1 || number === 0 ? String(number) : number < 0 ? '< −1' : '> 0';
};

export const classifyModality = (type: EventType) => {
  if (type === 'keydown') return 'Keyboard';
  return 'Undetermined';
};

export type InspectionSnapshot = {
  tag: string; focused: boolean; focusVisible: boolean; tabIndex: string;
  aria: string[][]; namingAttributes: string[]; rolePresent: boolean;
};
export type InspectionEvent = { type: EventType; target: string; elapsed: number };

export const formatInspectionMarkdown = (snapshot: InspectionSnapshot | null, events: readonly InspectionEvent[]) => {
  const lines = ['## Interaction Inspector', '', '### Element state'];
  if (snapshot) {
    lines.push(`- Element: \`${labelForTag(snapshot.tag)}\``, `- Focus: ${Boolean(snapshot.focused)}`, `- Focus visible: ${Boolean(snapshot.focusVisible)}`, `- Tabindex: ${['(absent)', '(invalid integer)', '-1', '0', '< −1', '> 0'].includes(snapshot.tabIndex) ? snapshot.tabIndex : '(invalid integer)'}`, `- Role attribute: ${snapshot.rolePresent ? 'Present' : 'Absent'}`);
    const values = new Map(snapshot.aria);
    for (const [name, value] of readAria(name => values.get(name) ?? null)) lines.push(`- ${name}: ${value}`);
    for (const name of ['aria-label', 'aria-labelledby', 'aria-describedby']) if (snapshot.namingAttributes.includes(name)) lines.push(`- ${name}: Present`);
  } else lines.push('No element selected.');
  lines.push('', '### Filtered timeline', '', '| Elapsed (ms) | Event | Element |', '| ---: | --- | --- |');
  for (const event of events.slice(-200)) {
    if (!eventTypes.includes(event.type) || !Number.isSafeInteger(event.elapsed) || event.elapsed < 0) continue;
    lines.push(`| ${event.elapsed} | ${event.type} | ${labelForTag(event.target)} |`);
  }
  return lines.join('\n');
};
