import pandas as pd
import geopandas as gpd

DATA_PATH = 'C:/Users/salah.ismail/OneDrive - unige.it/2nd term/unige.it/Data Visualization - 90529 - 2022-23/DataVisualization/Data'
GEOJSON_FILE = f'{DATA_PATH}/geo_data_trees.geojson'
CSV_FILE = f'{DATA_PATH}/top_20_trees.csv'

# Load GeoJSON data into a DataFrame
df = gpd.read_file(GEOJSON_FILE)

# Filter and convert the 'Canopy Cover (m2)' column
canopy_cover = df[:-1].copy()
canopy_cover['Canopy Cover (m2)'] = canopy_cover['Canopy Cover (m2)'].astype(float)

# Calculate count and mean canopy cover for each tree type
top_trees = canopy_cover.groupby('Name')['Canopy Cover (m2)'].agg(['count', 'mean']).round(2)

# Select the top X tree types
TOP_X = 20
top_trees = top_trees.nlargest(TOP_X, 'count').reset_index()

# Save the result to a CSV file
top_trees.to_csv(CSV_FILE, index=False)
