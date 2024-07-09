import { createSkinComponent } from '@epam/uui-core';
import {
    Text as UuiText,
    TextCoreProps,
    TextProps as UuiTextProps,
} from '@epam/uui';
import css from './Text.module.scss';

export interface TextMods {
    /**
     * @default 'Inter'
     */
    font?: 'Inter' | 'Prompt';
    color?:
        | 'info'
        | 'warning'
        | 'critical'
        | 'success'
        | 'primary'
        | 'secondary'
        | 'tertiary'
        | 'disabled'
        | 'white';
}

export type TextProps = TextCoreProps & TextMods;

export const Text = createSkinComponent<UuiTextProps, TextProps>(
    UuiText,
    undefined,
    (props) => [css.root, `uui-font-${props.font || 'Inter'}`],
);
