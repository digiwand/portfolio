import SummaryBase from 'components/sections/work/summary/Base';
import type { TechKey } from 'constants/tech';

const TECH_KEYS: readonly TechKey[] = [
  'REACT_NATIVE',
  'EXPO',
  'TYPESCRIPT',
  'PWA',
];

function SummaryTide() {
  return (
    <SummaryBase
      companyName="tide.ariella.dev"
      companyHref="https://tide.ariella.dev"
      title="Tide Timers"
      subtitle="Progressive Web App"
      date="Nov 2026"
      techKeys={TECH_KEYS}
    >
      A modular timer and counter app where one shared engine runs six tools: a tabletop life
      counter, circuit workouts, Pomodoro focus sessions, turn tracking, quick timers, and tallies.
      Its signature is a soft tide of color that drains like an hourglass. I built it with Expo and
      React Native and shipped it to the web as an installable, offline-ready PWA with alerts,
      haptics, and screen keep-awake.
    </SummaryBase>
  );
}

export default SummaryTide;
