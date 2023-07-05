from chart2 import pivot_data, top_X_trees

DATA_PATH = 'C:/Users/salah.ismail/OneDrive - unige.it/2nd term/unige.it/Data Visualization - 90529 - 2022-23/DataVisualization/Data'
CSV_FILE = f'{DATA_PATH}/top_trees_neighborhood_stacked.csv'

# Calculate "Other" percentage and sort the data
pivot_data_stacked = pivot_data.copy()
total = pivot_data_stacked[top_X_trees + ['Other']].sum(axis=1)
pivot_data_stacked['Other_perc'] = pivot_data_stacked['Other'] / total
pivot_data_stacked = pivot_data_stacked.sort_values(by='Other_perc').drop(columns='Other_perc')

# Save the sorted data to a CSV file
pivot_data_stacked.to_csv(CSV_FILE, index=False)

