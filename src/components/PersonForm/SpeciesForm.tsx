import { FlexCell, FlexRow, LabeledInput, PickerInput } from '@epam/uui';
import { ILens, useLazyDataSource } from '@epam/uui-core';
import { snakeCaseToTitleCase } from '../../utils';
import { lazySpeciesApi } from '../../api';
import { IPerson } from '../../types';

interface SpeciesFormProps {
    lens: ILens<IPerson['species']>;
}

export const SpeciesForm = ({ lens }: SpeciesFormProps) => {
    const speciesDS = useLazyDataSource(
        {
            api: lazySpeciesApi,
            getId: (item) => item.url,
        },
        [],
    );

    return (
        <FlexRow vPadding="12">
            <FlexCell grow={1}>
                <LabeledInput
                    label={snakeCaseToTitleCase('species')}
                    {...lens.toProps()}
                >
                    <PickerInput
                        key={'species'}
                        size="48"
                        emptyValue={[]}
                        valueType="id"
                        getName={(item) => item.name}
                        dataSource={speciesDS}
                        selectionMode="multi"
                        mode="inline"
                        placeholder="Species"
                        {...lens.toProps()}
                    />
                </LabeledInput>
            </FlexCell>
        </FlexRow>
    );
};
