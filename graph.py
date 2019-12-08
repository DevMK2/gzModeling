import os
import sys
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

def getCSVFile():
    csvFile = 'test.csv'
    if not sys.argv:
        return csvFile

    arg = sys.argv[-1]
    if not arg=='graph.py' and os.path.isfile(os.path.join('./', arg)):
        csvFile = arg
    return csvFile


if __name__ == '__main__':
    title = ['UpdatePhysics.csv',
             'UpdateCollision.csv',
             'Update.csv',
             'beforePhysicsUpdate.csv']

    fig, axes = plt.subplots(2, 2, figsize=(20, 20))

    csv = []
    for t in title:
        csv.append(pd.read_csv(t))

    ax = []
    for i, c in enumerate(csv):
        x = 0 if i<2 else 1
        y = i if i<2 else i-2
        ax.append(sns.lineplot(data=c['mean'], ax=axes[x][y]))

    for i, a in enumerate(ax): 
        a.set_title(title[i])
        a.set_xlabel('iteration')
        a.set_ylabel('update rate estimation')

    plt.show()
