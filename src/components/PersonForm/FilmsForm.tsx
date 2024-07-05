import React from "react";
import { FlexCell, FlexRow, LabeledInput, PickerInput } from "@epam/uui";
import { ILens, useLazyDataSource } from "@epam/uui-core";
import { snakeCaseToTitleCase } from "../../utils";
import { lazyFilmsApi } from "../../api";
import { IPerson } from "../../types";

interface FilmsFormProps {
    lens: ILens<IPerson["films"]>;
}

export const FilmsForm = ({ lens }: FilmsFormProps) => {
    const filmsDS = useLazyDataSource({
        api: lazyFilmsApi,
        getId: (item) => item.url,
    }, []);

    return (
        <FlexRow vPadding="12">
            <FlexCell grow={ 1 }>
                <LabeledInput label={ snakeCaseToTitleCase("films") } { ...lens.toProps() }>
                    <PickerInput
                        key={ "films" }
                        size="48"
                        emptyValue={ [] }
                        valueType="id"
                        getName={ item => item.title }
                        dataSource={ filmsDS }
                        selectionMode="multi"
                        mode="inline"
                        placeholder="Films"
                        { ...lens.toProps() }
                    />
                </LabeledInput>
            </FlexCell>
        </FlexRow>
    );
};
