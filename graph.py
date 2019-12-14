import os
import sys
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

class DataIDX:
    MAXABS = 0
    MEAN = 1
    MIN = 2
    VARIATE = 3


def getCSVFile():
    csvFile = 'test.csv'
    if not sys.argv:
        return csvFile

    arg = sys.argv[-1]
    if not arg=='graph.py' and os.path.isfile(os.path.join('./', arg)):
        csvFile = arg
    return csvFile


def drawSeaborn(_fileDF, _ax, _type='mean'):
    typedValues = _fileDF[_fileDF.type == _type]
    return sns.lineplot(data=typedValues, x='iteration', y='value', hue='section', ax=_ax)

def drawFourGraphs(_csv, _types, _axes):
    for i, type in enumerate(_types):
        x = 0 if i<2 else 1
        y = i if i<2 else i-2
        graph = drawSeaborn(_csv, _type=type, _ax=axes[x][y])
        graph.set_title('value of '+type)
        graph.set_xlabel('iteration(number of "POCO")')
        graph.set_ylabel('value(sec)')
    plt.suptitle('Diagnostics for '+filename)
    plt.show()

def drawSeabornValued(_fileDF, _ax, _type='mean'):
    typedValues = _fileDF[_fileDF.file == _type]
    return sns.lineplot(data=typedValues, x='iteration', y='value', hue='section', ax=_ax)

def drawValuedGraphs(_csv, _types, _axes):
    for i, type in enumerate(_types):
        x = 0 if i<2 else 1
        y = i if i<2 else i-2
        graph = drawSeabornValued(_csv, _type=type, _ax=axes[x][y])
        graph.set_title('value of '+type)
        graph.set_xlabel('iteration(number of "POCO")')
        graph.set_ylabel('value(sec)')
    plt.suptitle('Diagnostics for mean values of all files')
    plt.show()


if __name__ == '__main__':

    csv = pd.read_csv('test.csv')

    # all Files 
    title = ['UpdatePhysics',
             'UpdateCollision',
             'Update',
             'Step']

    # Draw graphs per Files, 4section per section
    #for filename in title:
    #    fig, axes = plt.subplots(2, 2, figsize=(20, 20))

    #    filedCsv = csv[csv.file == filename]

    #    types = ['maxAbs', 'mean', 'min', 'var']
    #    drawFourGraphs(filedCsv, types, axes)

    # Draw graphs one, 4section per files, only mean value
    meanValuedCsv = csv[csv.type == 'mean']
    fig, axes = plt.subplots(2, 2, figsize=(20, 20))
    drawValuedGraphs(meanValuedCsv, title, axes)
