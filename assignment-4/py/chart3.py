from chart1 import df, pd

DATA_PATH = 'C:/Users/salah.ismail/OneDrive - unige.it/2nd term/unige.it/Data Visualization - 90529 - 2022-23/DataVisualization/Data'

df['date'] = pd.to_datetime(df['date'], format='%d.%m.%Y')

df['month'] = df['date'].apply(lambda x: x.month)
df['year'] = df['date'].apply(lambda x: x.year)
df['day'] = df['date'].apply(lambda x: x.day)



for year in df['year'].unique():

    df_year = df[df['year'] == year]
    df_year = df_year[['max', 'month', 'day']]

    pivot = pd.pivot_table(df_year, index='day', columns='month',
                        values='max', aggfunc=sum).fillna(0).astype(float).reset_index()

    pivot = pivot.set_index('day').rename(columns={
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
        12: 'December',
    })

    pivot.to_csv(f'{DATA_PATH}/pivot_data_max_year_{year}.csv', index=False)


for year in df['year'].unique():

    df_year = df[df['year'] == year]
    df_year = df_year[['min', 'month', 'day']]

    pivot = pd.pivot_table(df_year, index='day', columns='month',
                        values='min', aggfunc=sum).fillna(0).astype(float).reset_index()

    pivot = pivot.set_index('day').rename(columns={
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
        12: 'December',
    })

    pivot.to_csv(f'{DATA_PATH}/pivot_data_min_year_{year}.csv', index=False)