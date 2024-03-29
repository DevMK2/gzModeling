import os
import sys
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

def autolabel(rects):
    """Attach a text label above each bar in *rects*, displaying its height."""
    for rect in rects:
        height = rect.get_height()
        ax.annotate('{}'.format(height),
                    xy=(rect.get_x() + rect.get_width() / 2, height),
                    xytext=(0, 3),  # 3 points vertical offset
                    textcoords="offset points",
                    ha='center', va='bottom')

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

def drawFourGraphs(_csv, _types, _axes, _filename):
    for i, type in enumerate(_types):
        x = 0 if i<2 else 1
        y = i if i<2 else i-2
        graph = drawSeaborn(_csv, _type=type, _ax=_axes[x][y])
        graph.set_title(type+' time')
        graph.set_xlabel('iteration(number of blocks)')
        graph.set_ylabel('time(sec)')
    plt.suptitle(_filename)
    plt.show()

def drawSeabornValued(_fileDF, _ax, _type='mean'):
    typedValues = _fileDF[_fileDF.file == _type]
    return sns.lineplot(data=typedValues, x='iteration', y='value', hue='section', ax=_ax)

def drawValuedGraphs(_csv, _types, _axes, _title):
    for i, type in enumerate(_types):
        x = 0 if i<2 else 1
        y = i if i<2 else i-2
        graph = drawSeabornValued(_csv, _type=type, _ax=_axes[x][y])
        graph.set_title(type)
        graph.set_xlabel('iteration(number of block)')
        graph.set_ylabel('value(sec)')
    plt.suptitle(_title +" execute time (sec)")
    plt.show()


def graph1(title, csv):
    for filename in title:
        fig, axes = plt.subplots(2, 2, figsize=(20, 20))

        filedCsv = csv[csv.file == filename]

        types = ['maxAbs', 'mean', 'min', 'var']
        drawFourGraphs(filedCsv, types, axes, filename)

def graph2(csv):
    meanValuedCsv = csv[csv.type == 'mean']
    fig, axes = plt.subplots(2, 2, figsize=(20, 20))
    drawValuedGraphs(meanValuedCsv, title, axes, 'mean')

    meanValuedCsv = csv[csv.type == 'maxAbs']
    fig, axes = plt.subplots(2, 2, figsize=(20, 20))
    drawValuedGraphs(meanValuedCsv, title, axes, 'maxAbs')

def graph3(title, csv):
    avg_csv = csv.groupby(['file', 'section', 'type'], as_index=False).max()

    avg_csv.value = avg_csv.value/100

    types  = ['maxAbs', 'mean']

    for type in types:
        fig, axes = plt.subplots(2, 2, figsize=(20, 20))
        for i, t in enumerate(title):
            x = 0 if i<2 else 1
            y = i if i<2 else i-2
            stepMean = avg_csv[avg_csv.file==t][avg_csv.type==type]
            graph = sns.barplot(data=stepMean, x='type', y='value', hue='section', ax=axes[x][y])
            graph.set_title(t)
            graph.set_ylabel('time(sec)')
            print('\n'+t)
            for i,r in stepMean.iterrows():
                print(r.file+" : " +r.section+" : "+str(r.value))

            if t == "Step":
                summ = 0
                for i,r in stepMean.iterrows():
                    if r.section != 'update' and r.section != 'Step':
                        summ += r.value
                print(summ);

        plt.suptitle('Average '+type+' execute time(sec) per block')
        plt.show()


if __name__ == '__main__':

    csv = pd.read_csv('test.csv')

    # all Files 
    title = ['UpdatePhysics',
             'UpdateCollision',
             'Update',
             'Step']

    # Draw graphs per Files, 4section per section
    # graph1(title, csv)

    # Draw graphs one, 4section per files, only mean value
    # graph2(csv)
    
    # Draw graphs two, 4section per files, man, mean values avg per sections
    graph3(title, csv)
