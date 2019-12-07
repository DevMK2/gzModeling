import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

test = pd.read_csv('test.csv')
print(test["mean"])

plt.figure(figsize=(15,6))
ax = sns.lineplot(data=test['mean'])
plt.show()
