from chart2 import data

DATA_PATH = 'C:/Users/salah.ismail/OneDrive - unige.it/2nd term/unige.it/Data Visualization - 90529 - 2022-23/DataVisualization/Data'
CSV_FILE = f'{DATA_PATH}/top_trees_neighborhood_unpivot.csv'

unpivot_data = data.groupby(by=['Neighborhood', 'Name']).sum().reset_index()
unpivot_data.to_csv(CSV_FILE, index=False)