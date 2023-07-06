import pandas as pd
import geopandas as gpd

DATA_PATH = './DataVisualization/data/'
ASSIGNMENT_PATH = "./assignment-2/data"

def load_and_convert_geojson_to_dataframe(file_path):
    return gpd.read_file(file_path)

def save_dataframe_to_csv(dataframe, file_path, index=False):
    dataframe.to_csv(file_path, index=index)

def preprocess_measurements(dataframe):
    columns = ['Height (m)', 'Crown Height (m)', 'Crown Width (m)', 'Canopy Cover (m2)']
    dataframe[columns] = dataframe[columns].apply(pd.to_numeric)
    return dataframe

def preprocess_top_trees_data(dataframe, top):
    trees_occurrences = dataframe[['Name', 'DBH (cm)']]
    top_trees = trees_occurrences.groupby('Name').count().round(2).rename(columns={'DBH (cm)': 'Count'}).reset_index()
    top_trees = top_trees.sort_values(by='Count', ascending=False)[:top]
    trees_name = top_trees['Name'].tolist()
    return trees_name

def filter_and_sample_dataframe(dataframe, trees_name, sample_frac):
    result = dataframe[dataframe.Name.isin(trees_name)]
    result = result.sort_values(by='Name')
    result = result.sample(frac=sample_frac)
    return result

# chart 1
df = load_and_convert_geojson_to_dataframe(f'{DATA_PATH}/geo_data_trees.geojson')
measure = preprocess_measurements(df[['Height (m)', 'Crown Height (m)', 'Crown Width (m)', 'Canopy Cover (m2)']][:-1])
save_dataframe_to_csv(measure, f'{ASSIGNMENT_PATH}/treesMeasures.csv')

# Chart 2
top = 6
measure = preprocess_measurements(df[['Name', 'Height (m)', 'Crown Height (m)', 'Crown Width (m)', 'Canopy Cover (m2)']][:-1])
trees_occurrences = df[['Name', 'DBH (cm)']]
top_trees = trees_occurrences.groupby('Name').count().round(2).rename(columns={'DBH (cm)': 'Count'}).reset_index()
trees_name = top_trees.sort_values(by='Count', ascending=False)[:top]['Name'].tolist()
result = measure[measure.Name.isin(trees_name)].sort_values(by='Name').sample(frac=0.3)
save_dataframe_to_csv(result, f'{ASSIGNMENT_PATH}/top_{top}_treesMeasures.csv', index=False)

# Chart 3
data_task3 = preprocess_measurements(df[['Name', 'Height (m)', 'Crown Width (m)', 'Canopy Cover (m2)', 'Crown Height (m)', 'Gross Carbon Sequestration (kg/yr)', 'Gross Carbon Sequestration (eur/yr)']][:-1])
trees_occurrences = df[['Name', 'DBH (cm)']]
top_trees = trees_occurrences.groupby('Name').count().round(2).rename(columns={'DBH (cm)': 'Count'}).reset_index()
trees_name = top_trees.sort_values(by='Count', ascending=False)[:top]['Name'].tolist()
result = data_task3[data_task3.Name.isin(trees_name)].sort_values(by='Name').sample(frac=0.5)
save_dataframe_to_csv(result, f'{ASSIGNMENT_PATH}/top_{top}_treesMeasuresScatter.csv', index=False)


# Chart 4
data_task4 = preprocess_measurements(df[['Name', 'Height (m)', 'Crown Width (m)', 'Canopy Cover (m2)', 'Crown Height (m)', 'Gross Carbon Sequestration (kg/yr)', 'Gross Carbon Sequestration (eur/yr)']][:-1])
trees_occurrences = df[['Name', 'DBH (cm)']]
top_trees = trees_occurrences.groupby('Name').count().round(2).rename(columns={'DBH (cm)': 'Count'}).reset_index()
trees_name = top_trees.sort_values(by='Count', ascending=False)[:top]['Name'].tolist()
result = data_task4[data_task4.Name.isin(trees_name)].sort_values(by='Name')
save_dataframe_to_csv(result, f'{ASSIGNMENT_PATH}/top_{top}_treesMeasuresSmallMulti.csv', index=False)

# Chart 5
data_task5 = preprocess_measurements(df[['Name', 'Height (m)', 'Crown Width (m)', 'Canopy Cover (m2)', 'Crown Height (m)', 'Gross Carbon Sequestration (kg/yr)']][:-1])
trees_occurrences = df[['Name', 'DBH (cm)']]
top_trees = trees_occurrences.groupby('Name').count().round(2).rename(columns={'DBH (cm)': 'Count'}).reset_index()
trees_name = top_trees.sort_values(by='Count', ascending=False)[:top]['Name'].tolist()
result = data_task5[data_task5.Name.isin(trees_name)].sort_values(by='Name').sample(frac=0.3)
save_dataframe_to_csv(result, f'{ASSIGNMENT_PATH}/top_{top}_treesMeasuresBubble.csv', index=False)
