import React, { PropsWithChildren } from "react";
import cx from "classnames";
import css from "./FlexBox.module.scss";
import { Blocker, ScrollBars } from "@epam/uui";

interface IFlexBoxProps extends PropsWithChildren {
    enableLoading?: boolean;
}

export const FlexBox = (props: IFlexBoxProps) => {
    const classNames = cx(
        css["flex-box"],
    );

    return (
        <div className={ css.wrapper }>
            <ScrollBars height={ "inherit" }>
                <div className={ classNames }>
                    { props.children }
                </div>
            </ScrollBars>
            <Blocker isEnabled={ !!props.enableLoading } />
        </div>
    );
};
