import { FlexCell, FlexRow, LabeledInput, PickerInput } from '@epam/uui';
import { ILens, useLazyDataSource } from '@epam/uui-core';
import { snakeCaseToTitleCase } from '../../utils';
import { lazyPlanetsApi } from '../../api';
import { IPerson } from '../../types';

interface HomeworldFormProps {
    lens: ILens<IPerson['homeworld']>;
}

export const HomeworldForm = ({ lens }: HomeworldFormProps) => {
    const homeworldDS = useLazyDataSource(
        {
            api: lazyPlanetsApi,
            getId: (item) => item.url,
        },
        [],
    );

    return (
        <FlexRow vPadding="12">
            <FlexCell grow={1}>
                <LabeledInput
                    label={snakeCaseToTitleCase('homeworld')}
                    {...lens.toProps()}
                >
                    <PickerInput
                        key={'homeworld'}
                        size="48"
                        emptyValue={undefined}
                        valueType="id"
                        getName={(item) => item.name}
                        dataSource={homeworldDS}
                        selectionMode="single"
                        mode="inline"
                        placeholder="Homeworld"
                        {...lens.toProps()}
                    />
                </LabeledInput>
            </FlexCell>
        </FlexRow>
    );
};
