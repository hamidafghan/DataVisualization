################################ CHART 2 #################################################
import json
import pandas as pd
from shapely.geometry import Point, Polygon
from chart1 import df
from chart1 import top_trees

top = 5

# Load "circoscrizioni" file (neighborhoods) and create a map
nbhs_map = {}
nbhs_map2 = {}
DATA_PATH = 'C:/Users/salah.ismail/OneDrive - unige.it/2nd term/unige.it/Data Visualization - 90529 - 2022-23/DataVisualization/Data'
CSV_FILE = f'{DATA_PATH}/top_trees_neighborhood.csv'

circoscrizioniFile = f'{DATA_PATH}/circoscrizioni.json'
with open(circoscrizioniFile, 'r') as neighborhoods:
    nbhs = json.load(neighborhoods)
    
    for nbh in nbhs['features']:
        nbh_name = nbh['properties']['nome']
        nbh_polygon = Polygon(nbh['geometry']['coordinates'][0])
        nbhs_map[nbh_name] = nbh_polygon
        nbhs_map2[nbh_name] = nbh['properties']['area']

# Define a function to retrieve the name of the neighborhood for a given point
def point_to_neighborhood(point):
    for nbh_name, nbh_polygon in nbhs_map.items():
        if nbh_polygon.contains(point):
            return nbh_name

# Retrieve the neighborhood for each longitude and latitude in the data
data = df[['Longitude', 'Latitude', 'Name']][:-1]  # Remove the last line because it represents the total

data['Neighborhood'] = data.apply(lambda x: point_to_neighborhood(Point(x.Longitude, x.Latitude)), axis=1)
data = data[['Name', 'Neighborhood']]

# Keep only the top X trees and generalize the rest as "Other"
all_trees = df['Name'].unique()
top_X_trees = list(top_trees[:top]['Name'])
other_trees = list(set(all_trees) - set(top_X_trees))

data['Name'] = data['Name'].map({tree: (tree if tree in top_X_trees else 'Other') for tree in all_trees})
data['Count'] = 1

# Pivot the dataframe and fill any missing values
pivot_data = pd.pivot_table(data, index='Neighborhood', columns='Name', values='Count', aggfunc=sum).fillna(0).astype(int).reset_index()

# Order columns based on the order of the top X trees
column_order = ['Neighborhood'] + top_X_trees + ['Other']
pivot_data = pivot_data[column_order].sort_values(by='Other', ascending=False)

# Save the data to a CSV file
pivot_data.to_csv(CSV_FILE, index=False)
