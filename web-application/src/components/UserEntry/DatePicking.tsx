import React from 'react';
import { useField, useFormikContext } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parse, format } from 'date-fns';

interface DatePickingProps {
    name: string;
}

const DatePicking: React.FC<DatePickingProps> = ({ name }) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);

    const handleDateChange = (date: Date | null) => {
        if (date && !isNaN(date.getTime())) { // Check if the date is valid
            setFieldValue(name, format(date, 'dd/MM/yyyy'));
        }
    };

    const dateValue = field.value ? parse(field.value, 'dd/MM/yyyy', new Date()) : null;

    // Additional check to prevent setting invalid dates
    if (dateValue && isNaN(dateValue.getTime())) {
        setFieldValue(name, null);
    }

    return (
        <div className="relative">
            <DatePicker
                {...field}
                selected={dateValue}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                className="w-[400px] h-12 text-center font-semibold text-black text-opacity-80 rounded-xl"
                placeholderText="Your Birthday"
            />
            {meta.touched && meta.error ? (
                <p className="text-red-500 font">{meta.error}</p>
            ) : null}
        </div>
    );
};

export default DatePicking;