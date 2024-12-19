import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import ttest_ind, chi2_contingency

data = pd.read_csv("data.csv")

data['IdentifierStyle'] = data['Selected Identifier'].apply(lambda x: 'kebab-case' if '-' in x else 'camelCase')

data['AgeGroup'] = data['Age'].apply(lambda x: 'Above 25' if x > 25 else '25 and Below')

mean_times = data.groupby('IdentifierStyle')['Time Taken'].mean()
accuracy_rates = data.groupby('IdentifierStyle')['IsCorrect'].mean()

print("Mean times:")
print(mean_times)
print("\nAccuracy rates:")
print(accuracy_rates)

#t-test for time
kebab_times = data[data['IdentifierStyle'] == 'kebab-case']['Time Taken']
camel_times = data[data['IdentifierStyle'] == 'camelCase']['Time Taken']
t_stat, p_val = ttest_ind(kebab_times, camel_times)
print("\nPaired t-test for time:")
print(f"t-statistic: {t_stat}, p-value: {p_val}")

#Chi-squared test for accuracy
accuracy_contingency = pd.crosstab(data['IdentifierStyle'], data['IsCorrect'])
chi2, chi2_p, _, _ = chi2_contingency(accuracy_contingency)
print("\nChi-squared test for accuracy:")
print(f"Chi-squared: {chi2}, p-value: {chi2_p}")

#grouped by programming experience and age group
grouped_stats = data.groupby(['Programming Level', 'AgeGroup', 'IdentifierStyle']).agg({
    'Time Taken': ['mean', 'std'],
    'IsCorrect': 'mean'
})
print("\nGrouped stats by programming experience and age group:")
print(grouped_stats)

sns.set(style="whitegrid")

#Boxplot for Time Taken by Identifier Style
plt.figure(figsize=(10, 6))
sns.boxplot(x='IdentifierStyle', y='Time Taken', data=data)
plt.title("Time Taken by Identifier Style")
plt.savefig("time_by_style.png")
plt.show()

#Bar Plot for Accuracy Rates by Identifier Style
accuracy_plot = accuracy_rates.reset_index()
plt.figure(figsize=(10, 6))
sns.barplot(x='IdentifierStyle', y='IsCorrect', data=accuracy_plot)
plt.title("Accuracy Rates by Identifier Style")
plt.savefig("accuracy_by_style.png")
plt.show()

#interaction Plot - Programming Level, Age Group, and Identifier Style
plt.figure(figsize=(10, 6))
sns.barplot(x='Programming Level', y='Time Taken', hue='IdentifierStyle', data=data, ci=None)
plt.title("Interaction: Programming Level, Age Group, and Identifier Style")
plt.savefig("interaction_plot.png")
plt.show()

#age and Performance
plt.figure(figsize=(10, 6))
sns.scatterplot(x='Age', y='Time Taken', hue='IdentifierStyle', data=data)
plt.title("Age vs Time Taken by Identifier Style")
plt.savefig("age_vs_time.png")
plt.show()

grouped_stats.to_csv("grouped_stats_by_age.csv")
