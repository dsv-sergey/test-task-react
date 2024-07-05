import React from "react";
import { FlexCell, FlexRow, LabeledInput, PickerInput } from "@epam/uui";
import { ILens, useLazyDataSource } from "@epam/uui-core";
import { snakeCaseToTitleCase } from "../../utils";
import { lazyVehiclesApi } from "../../api";
import { IPerson } from "../../types";

interface VehiclesFormProps {
    lens: ILens<IPerson["vehicles"]>;
}

export const VehiclesForm = ({ lens }: VehiclesFormProps) => {
    const vehiclesDS = useLazyDataSource({
        api: lazyVehiclesApi,
        getId: (item) => item.url,
    }, []);

    return (
        <FlexRow vPadding="12">
            <FlexCell grow={ 1 }>
                <LabeledInput label={ snakeCaseToTitleCase("vehicles") } { ...lens.toProps() }>
                    <PickerInput
                        key={ "vehicles" }
                        size="48"
                        emptyValue={ [] }
                        valueType="id"
                        getName={ item => item.name }
                        dataSource={ vehiclesDS }
                        selectionMode="multi"
                        mode="inline"
                        placeholder="Vehicles"
                        { ...lens.toProps() }
                    />
                </LabeledInput>
            </FlexCell>
        </FlexRow>
    );
};
