Table_A (name) 2 Columns: name_id, name
Table B (income) 2 Columns: id, income

Q: For each name, what is avg income:
    
SELECT a.name, AVG(b.income) AS avg_income

FROM Table_A a 
LEFT JOIN Table_B b on a.name_id = b.id
GROUP BY a.name_id



Q2: Python:
    
df1=pd.DataFrame(data=Table A)
df2=pd.DataFrame(data=Table B)

df_3=df1.merge(df2, HOW='LEFT', left_on= 'name_id', right_on='id')

df_3.GroupBy('df1.name').mean()['income']



