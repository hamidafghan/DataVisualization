from chart2 import data
from chart3 import unpivot_data

DATA_PATH = 'C:/Users/salah.ismail/OneDrive - unige.it/2nd term/unige.it/Data Visualization - 90529 - 2022-23/DataVisualization/Data'


for nbh in data['Neighborhood'].unique():
    CSV_FILE = f'{DATA_PATH}/top_trees_{nbh}.csv'
    unpivot_data[unpivot_data['Neighborhood'] == nbh].sort_values(by='Count', ascending=False).to_csv(CSV_FILE, index=False)
