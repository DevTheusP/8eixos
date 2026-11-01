import {
  Compass, Globe, Repeat, Search, SlidersHorizontal, Sparkles, Sprout, UserRound,
  Anchor, Award, Brain, CalendarCheck, CircleHelp, CloudLightning, Feather, Flower2, Hammer, Heart, PenLine,
  Shuffle, Sun, User, Users, Wine, type LucideIcon,
} from 'lucide-react';
import type { AxisId } from './types';

// Um ícone por polo, na ordem A → B de data/axes.json.
export const POLE_ICONS: Record<AxisId, { A: LucideIcon; B: LucideIcon }> = {
  controle: { A: Feather, B: Hammer },
  bemviver: { A: Award, B: Wine },
  sentido: { A: Sun, B: PenLine },
  mundo: { A: Flower2, B: CloudLightning },
  eu: { A: User, B: Users },
  rotina: { A: CalendarCheck, B: Shuffle },
  guia: { A: Brain, B: Heart },
  verdade: { A: Anchor, B: CircleHelp },
};

// Ícone do eixo como um todo (etiqueta da pergunta no quiz).
export const AXIS_ICONS: Record<AxisId, LucideIcon> = {
  controle: SlidersHorizontal,
  bemviver: Sprout,
  sentido: Sparkles,
  mundo: Globe,
  eu: UserRound,
  rotina: Repeat,
  guia: Compass,
  verdade: Search,
};
