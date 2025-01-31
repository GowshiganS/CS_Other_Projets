import time
import matplotlib.pyplot as plt  # pour afficher le temps
from random import randrange

def randlist(n, a=100, b=1000):
    return [randrange(a, b) for _ in range(n)]

def tri_insertion(L):
    start_time = time.time()
    n = len(L)
    for i in range(1, n):
        valeur = L[i]
        j = i - 1
        while j >= 0 and L[j] > valeur:
            L[j + 1] = L[j]
            j -= 1
        L[j + 1] = valeur  # Ne pas oublier d'insérer la valeur à la bonne position
    return time.time() - start_time

def tri_bulle(L):
    start_time = time.time()
    n = len(L)
    for i in range(n):
        for j in range(0, n - i - 1):
            if L[j] > L[j + 1]:
                L[j], L[j + 1] = L[j + 1], L[j]
    return time.time() - start_time

def tri_selection(L):
    start_time = time.time()
    n = len(L)
    for i in range(n - 1, 0, -1):
        Min = L[0]
        for j in range(1, i + 1):
            if L[j] > Min:
                L[j - 1] = L[j]
            else:
                L[j - 1] = Min
                Min = L[j]
        L[i] = Min
    return time.time() - start_time

# Tailles des tableaux à tester
taille_tableaux = [10, 100, 1000, 10000]

# Stockage des temps d'exécution pour chaque algorithme
times_insertion = []
times_bulle = []
times_selection = []

for taille in taille_tableaux:
    tableau_insertion = randlist(taille)
    temps_insertion = tri_insertion(tableau_insertion)
    times_insertion.append(temps_insertion)

    tableau_bulle = randlist(taille)
    temps_bulle = tri_bulle(tableau_bulle)
    times_bulle.append(temps_bulle)

    tableau_selection = randlist(taille)
    temps_selection = tri_selection(tableau_selection)
    times_selection.append(temps_selection)

# Tracer les résultats
plt.plot(taille_tableaux, times_insertion, marker='D', label='Tri par Insertion')
plt.plot(taille_tableaux, times_bulle, marker='D', label='Tri à Bulles')
plt.plot(taille_tableaux, times_selection, marker='D', label='Tri par Sélection')

plt.ylabel('Temps en secondes')
plt.xlabel("Nombre d'éléments")
plt.title("Comparaison des Temps d'Exécution des Algorithmes de Tri")
plt.legend()  # Utiliser une échelle logarithmique pour une meilleure visualisation

plt.show()
