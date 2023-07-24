import { omit } from 'lodash';

import { LocaleState } from './types';
import { langs } from './langs';

export const defaultLang: LocaleState = omit(langs[0], ['antdData']) as LocaleState;
