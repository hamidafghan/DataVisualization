import pandas as pd
import csv
from datetime import datetime

# Define the input and output file paths
DATA_PATH = 'C:/Users/salah.ismail/OneDrive - unige.it/2nd term/unige.it/Data Visualization - 90529 - 2022-23/DataVisualization/Data'
input_file = f'{DATA_PATH}/data_Salurn-Salorno-multiannual-LT-N-daily-temperature-precipitation.csv'
output_file = f'{DATA_PATH}/temp_Salorno.csv'

# Define the start date for filtering
start_date = datetime.strptime('01.01.1993', '%d.%m.%Y')

# Open the input and output CSV files
with open(input_file, 'r') as file_in, open(output_file, 'w', newline='') as file_out:
    # Create CSV reader and writer objects
    reader = csv.reader(file_in)
    writer = csv.writer(file_out)

    # Write the header row to the output file
    header = next(reader)
    writer.writerow(header)

    # Filter and write the data rows
    for row in reader:
        date = datetime.strptime(row[0], '%d.%m.%Y')  # Assuming date is in the first column
        if date >= start_date:
            writer.writerow(row)

print("Filtered data saved to", output_file)



# Read the CSV file
temp_Salorno = f'{DATA_PATH}/temp_Salorno.csv'
df = pd.read_csv(temp_Salorno)

# Extract year and month from the 'date' column
df['year'] = pd.to_datetime(df['date'], format='%d.%m.%Y').dt.year
df['month'] = pd.to_datetime(df['date'], format='%d.%m.%Y').dt.month

# Clean non-numeric data in "min" and "max" columns
df['min'] = pd.to_numeric(df['min'], errors='coerce').fillna(0)
df['max'] = pd.to_numeric(df['max'], errors='coerce').fillna(0)

# Group by year and month, calculate min, max, and mean
grouped = df.groupby(['year', 'month']).agg({'min': 'min', 'max': 'max'}).reset_index()
grouped['mean'] = round((grouped['min'] + grouped['max']) / 2, 2)

# Replace month numbers with month names
month_map = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
}
grouped['month'] = grouped['month'].map(month_map)


# Save the cleaned and grouped data to a new CSV file
output_file = f'{DATA_PATH}/daily_temp_data.csv'
grouped.to_csv(output_file, index=False)
