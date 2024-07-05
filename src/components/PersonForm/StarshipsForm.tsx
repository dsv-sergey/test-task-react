import React from "react";
import { FlexCell, FlexRow, LabeledInput, PickerInput } from "@epam/uui";
import { ILens, useLazyDataSource } from "@epam/uui-core";
import { snakeCaseToTitleCase } from "../../utils";
import { lazyStarshipsApi } from "../../api";
import { IPerson } from "../../types";

interface StarshipsFormProps {
    lens: ILens<IPerson["starships"]>;
}

export const StarshipsForm = ({ lens }: StarshipsFormProps) => {
    const starshipsDS = useLazyDataSource({
        api: lazyStarshipsApi,
        getId: (item) => item.url,
    }, []);

    return (
        <FlexRow vPadding="12">
            <FlexCell grow={ 1 }>
                <LabeledInput label={ snakeCaseToTitleCase("starships") } { ...lens.toProps() }>
                    <PickerInput
                        key={ "starships" }
                        size="48"
                        emptyValue={ [] }
                        valueType="id"
                        getName={ item => item.name }
                        dataSource={ starshipsDS }
                        selectionMode="multi"
                        mode="inline"
                        placeholder="Starships"
                        { ...lens.toProps() }
                    />
                </LabeledInput>
            </FlexCell>
        </FlexRow>
    );
};
