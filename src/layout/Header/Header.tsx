import React, { ReactNode } from "react";
import cx from "classnames";
import css from "./Header.module.scss";

type THeader = {
    title: string | ReactNode;
    subtitle?: string;
};

export const Header = (props: THeader) => {
    return (
        <div className={ css.wrapper }>
            <div className={ cx("container") }>
                <h1 className={ css.title }>{ props.title }</h1>
            </div>
        </div>

    );
};