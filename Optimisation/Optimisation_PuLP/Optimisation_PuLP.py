import pulp
############################################### 
#Exercice 1: 
###############################################
# Création du problème de maximisation
prob = pulp.LpProblem("Maximiser_le_profit_de_la_ferme", pulp.LpMaximize)

# Définition des variables de décision
T = pulp.LpVariable('Tomates', lowBound=0, cat='Continuous')
C = pulp.LpVariable('Concombres', lowBound=0, cat='Continuous')

# Fonction objectif
prob += 3 * T + 2 * C, "Profit_total"

# Contraintes
prob += T + C <= 50, "Contrainte_de_terrain"
prob += 20 * T + 10 * C <= 1000, "Contrainte_de_main_d'oeuvre"

# Résolution du problème
prob.solve()

# Affichage des résultats
print("Statut de la solution :", pulp.LpStatus[prob.status])
print(f"Quantité optimale de tomates (kg) : {T.varValue}")
print(f"Quantité optimale de concombres (kg) : {C.varValue}")
print(f"Profit total optimal : {pulp.value(prob.objective)}")

import numpy as np
import matplotlib.pyplot as plt

# Définir les contraintes
# Contrainte 1 : x + y <= 50
# Contrainte 2 : 20x + 10y <= 1000

# Créer les points pour la contrainte 1
x = np.linspace(0, 60, 400)
y1 = 50 - x  # y = 50 - x

# Créer les points pour la contrainte 2
y2 = (1000 - 20 * x) / 10  # y = (1000 - 20x) / 10

# Déterminer les points d'intersection
# Résoudre x + y = 50 et 20x + 10y = 1000
# x + y = 50 => y = 50 - x
# 20x + 10(50 - x) = 1000 => 20x + 500 - 10x = 1000 => 10x = 500 => x = 50 => y = 0
# Ce point est (50, 0)
intersection1 = (50, 0)

# 20x + 10y = 1000 => y = (1000 - 20x) / 10
# Vérifier les points d'intersection des contraintes
x_int = 30  # Point optimal en x
y_int = 20  # Point optimal en y

# Créer le graphique
plt.figure(figsize=(10, 6))

# Tracer les contraintes
plt.plot(x, y1, label=r'$Terrain$', color='blue')
plt.plot(x, y2, label=r"$Main\ d'oeuvre$", color='orange')

# Remplir la région réalisable
plt.fill_between(x, np.minimum(y1, y2), where=(y1 >= 0) & (y2 >= 0), color='lightgreen', alpha=0.5)

# Tracer les axes
plt.xlim(0, 60)
plt.ylim(0, 60)
plt.axhline(0, color='black',linewidth=0.5, ls='--')
plt.axvline(0, color='black',linewidth=0.5, ls='--')

# Annoter les points
plt.scatter(*intersection1, color='red', label='Optimale', zorder=5)


# Annotations pour les axes et le titre
plt.title('Résolution Graphique de la Programmation Linéaire: La ferme')
plt.xlabel('Quantité optimale de tomates (kg)')
plt.ylabel('Quantité optimale de concombres (kg)')
plt.legend()

# Afficher le graphique
#plt.show()


# Création du problème de maximisation
prob = pulp.LpProblem("Maximiser_le_profit_de_l'usine", pulp.LpMaximize)

# Définition des variables de décision
T = pulp.LpVariable('Tables', lowBound=0, cat='Integer')
C = pulp.LpVariable('Chaises', lowBound=0, cat='Integer')

# Fonction objectif
prob += 70 * T + 50 * C, "Profit_total"

# Contraintes
prob += 4*T + 3*C <= 240, "Contrainte_de_matériel"
prob += 2*T + C <= 100, "Contrainte_de_main_d'oeuvre"

# Résolution du problème
prob.solve()

# Affichage des résultats
print("Statut de la solution :", pulp.LpStatus[prob.status])
print(f"Quantité optimale de Tables  : {T.varValue}")
print(f"Quantité optimale de chaises : {C.varValue}")
print(f"Profit total optimal : {pulp.value(prob.objective)}")

############################################### 
#Exercice 3: 
###############################################
# Création du problème de maximisation
prob = pulp.LpProblem("Maximiser_le_profit_de_l'entreprise", pulp.LpMaximize)

# Définition des variables de décision
S = pulp.LpVariable('Chaussures de sport', lowBound=0, cat='Integer')
C = pulp.LpVariable('Chaussures classique', lowBound=0, cat='Integer')

# Fonction objectif
prob += 50 * S + 40 * C, "Profit_total"

# Contraintes
prob += 2*S + C <= 800, "Contrainte_de_couture"
prob += S + 1.5 *C <= 600, "Contrainte_de_main_d'oeuvre"

# Résolution du problème
prob.solve()

# Affichage des résultats
print("Statut de la solution :", pulp.LpStatus[prob.status])
print(f"Quantité optimale de Chaussures de sport  : {S.varValue}")
print(f"Quantité optimale de Chaussures classique : {C.varValue}")
print(f"Profit total optimal : {pulp.value(prob.objective)}")


############################################### 
#Exercice 4: 
###############################################

# Création du problème de maximisation
prob = pulp.LpProblem("Maximiser_le_profit_de_l'atelier", pulp.LpMaximize)

# Définition des variables de décision
C = pulp.LpVariable('Coliers', lowBound=0, cat='Integer')
B = pulp.LpVariable('Bracelets', lowBound=0, cat='Integer')

# Fonction objectif
prob += 200 * C + 120 * B, "Profit_total"

# Contraintes
prob += 5*C + 3*B <= 300, "Contrainte_de_matériel"
prob += 2*C + B <= 120, "Contrainte_de_main_d'oeuvre"

# Résolution du problème
prob.solve()

# Affichage des résultats
print("Statut de la solution :", pulp.LpStatus[prob.status])
print(f"Quantité optimale de Coliers : {C.varValue}")
print(f"Quantité optimale de Bracelets : {B.varValue}")
print(f"Profit total optimal : {pulp.value(prob.objective)}")


# Définir les contraintes
# Contrainte 1 : 5x + 3y <= 300
# Contrainte 2 : 2x + y <= 120


x = np.linspace(0, 300, 500)

# Créer les points pour la contrainte 1
y1 = (300-5*x)/3  # y = (300-5x)/3

# Créer les points pour la contrainte 2
y2 = 120 - 2*x  # y = 120-2x


# Déterminer les points d'intersection
# Résoudre 2x+y=120 et 5x+3y=300
# 2x+y=120 => y = 120+2x
# 5x+3(120-2x)=300 => 5x+360-6x = 300 => -x=-60 => x= 60
# y = 120 - 2* 60 = 0
# Ce point est (60, 0)



intersection1 = (60, 0)

# 20x + 10y = 1000 => y = (1000 - 20x) / 10
# Vérifier les points d'intersection des contraintes
x_int = 30  # Point optimal en x
y_int = 20  # Point optimal en y

# Créer le graphique
plt.figure(figsize=(10, 6))

# Tracer les contraintes
plt.plot(x, y1, label=r'$Matériel$', color='blue')
plt.plot(x, y2, label=r"$Main\ d'oeuvre$", color='orange')

# Remplir la région réalisable
plt.fill_between(x, np.minimum(y1, y2), where=(y1 >= 0) & (y2 >= 0), color='lightgreen', alpha=0.5)

# Tracer les axes
plt.xlim(0, 100)
plt.ylim(0, 150)
plt.axhline(0, color='black',linewidth=0.5, ls='--')
plt.axvline(0, color='black',linewidth=0.5, ls='--')

# Annoter les points
plt.scatter(*intersection1, color='red', label='Optimale', zorder=5)


# Annotations pour les axes et le titre
plt.title('Résolution Graphique de la Programmation Linéaire: Atelier de Bijoux')
plt.xlabel('Quantité optimale de Coliers')
plt.ylabel('Quantité optimale de Bracelets ')
plt.legend()

# Afficher le graphique
plt.show()





############################################### 
#Exercice 5: 
###############################################

# Création du problème de maximisation
prob = pulp.LpProblem("Maximiser_le_profit_de_l'atelier", pulp.LpMaximize)

# Définition des variables de décision
B = pulp.LpVariable('Blé', lowBound=0, cat='Continuous')
M = pulp.LpVariable('Maïs', lowBound=0, cat='Continuous')

# Fonction objectif
prob += 500 * B + 400 *M, "Profit_total"

# Contraintes
prob += B + M <= 150, "Contrainte_de_terrain"
prob += 100*B + 150*M <= 20000, "Contrainte_de_main_d'oeuvre"

# Résolution du problème
prob.solve()

# Affichage des résultats
print("Statut de la solution :", pulp.LpStatus[prob.status])
print(f"Quantité optimale de Blé : {B.varValue}")
print(f"Quantité optimale de Maïs : {M.varValue}")
print(f"Profit total optimal : {pulp.value(prob.objective)}")

############################################### 
#Devoir: 
###############################################

# Création du problème de maximisation avec PuLP
prob = pulp.LpProblem("Maximiser_le_profit_de_l'entreprise", pulp.LpMaximize)

# Définition des variables de décision avec pour borne inférieure 0 et catégorie de variable ici entier car on peut pas avoir une partie de produit
P1 = pulp.LpVariable('P1', lowBound=0, cat='Integer') # Produit 1
P2 = pulp.LpVariable('P2', lowBound=0, cat='Integer') # Produit 2
P3 = pulp.LpVariable('P3', lowBound=0, cat='Integer') # Produit 3


# Fonction objectif => maximiser le profit en euros.
prob += 60*P1+50*P2+70*P3, "Profit_total"

# Contraintes:
prob += 2*P1 +P2+ 2*P3 <= 100, "Contrainte_Machine_1" # Production sur machine 1
prob += P1 +2*P2+ P3 <= 80, "Contrainte_Machine_2" # Production sur machine 2
prob += P1 +P2+ 2*P3 <= 90, "Contrainte_Machine_3" # Production sur machine 3

# Résolution du problème avec PuLP
prob.solve()

# Affichage des résultats
print("Statut de la solution :", pulp.LpStatus[prob.status])
print(f"Quantité optimale de P1 : {P1.varValue}")
print(f"Quantité optimale de P2 : {P2.varValue}")
print(f"Quantité optimale de P3 : {P3.varValue}")
print(f"Profit total optimal : {pulp.value(prob.objective)}")

