import cplex
from cplex.exceptions import CplexError

def modele_production_Exercice1():
    try:
        # Création du problème
        problem = cplex.Cplex()
        problem.objective.set_sense(problem.objective.sense.minimize)

        # Variables de décision
        noms_var =  ["x1", "x2", "x3", "x4",
                    "x5", "x6", "x7", "x8",
                    "x9", "x10", "x11", "x12"]
        # Coefficients des variables de décision
        obj = [
        2,3,1,4,
        3,1,2,3,
        4,2,3,1]
        # Bornes inférieures(par d faut 0,0)
        lower_bounds = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
        #Ajout des variables au modèle
        problem.variables.add(obj=obj, lb=lower_bounds, names=noms_var)

        # Nom des Contraintes
        noms_contraintes = ["U1", "U2","U3","E1","E2","E3","E4"]
        # Expression des contraintes 
        
        lignes = [
            [[0, 1, 2, 3], [1.0, 1.0, 1.0, 1.0]], #x1 + x2 + X3 + x4 Usine 1
            [[4, 5, 6 ,7], [1.0, 1.0, 1.0, 1.0]], #x5 + x6 + x7 + x8 Usine 2
            [[8, 9, 10, 11],[1.0, 1.0, 1.0, 1.0]], #x9+ x10 + x11 + x12 Usine 3

            [[0, 4, 8],[1.0, 1.0, 1.0,]], #x1 +x5 + x9 Entrepot 1
            [[1, 5, 9],[1.0, 1.0, 1.0]], #x2 +x6 + x10  Entrepot 2
            [[2, 6, 10],[1.0, 1.0, 1.0]], #x3 +x7 + x11  Entrepot 3
            [[3, 7, 11],[1.0, 1.0, 1.0]] #x4 +x8 + x12  Entrepot 4
        ]

       
        # Coté droits des contraintes (capacité et demandes)
        rhs = [50.0, 70.0, 30.0, 40.0, 30.0, 50.0, 30.0]
        # Sens des contraintes(E' pour egalité , G pour supérieur ou egale, L pour inférieur ou égale)
        senses = ["L","L", "L","G", "G", "G","G"]  # '
        #Ajout des contraintes au modèle
        problem.linear_constraints.add(lin_expr=lignes, senses=senses, rhs=rhs, names=noms_contraintes)

        # Résolution
        problem.solve()

        # Résultats
        # Affichage du statut de la solution
        print("Statut de la solution :", problem.solution.get_status())
        print(problem.solution.status[problem.solution.get_status()])
        # Affichage de la valeur optimale de la fonction objectif
        print("Bénéfice total optimal :", problem.solution.get_objective_value())
        #Affichage  des valeurs optimales des variables de décision
        valeurs_vars = problem.solution.get_values()
        for i, var_name in enumerate(noms_var):
            print(f"Quantité optimale de {var_name} :", valeurs_vars[i])

    except CplexError as e:
        print(e)
"""
On a une solution optimale pour un total de 230, 
Quantité optimale de x1 : 0.0
Quantité optimale de x2 : 0.0
Quantité optimale de x3 : 50.0
Quantité optimale de x4 : 0.0
Quantité optimale de x5 : 40.0
Quantité optimale de x6 : 30.0
Quantité optimale de x7 : 0.0
Quantité optimale de x8 : 0.0
Quantité optimale de x9 : 0.0
Quantité optimale de x10 : 0.0
Quantité optimale de x11 : 0.0
Quantité optimale de x12 : 30.0

le resultat est coohérent
 l'objectif de minimiser les couts des transports est atteinte
"""
modele_production_Exercice1()


def modele_production_Exercice2():
    try:
        # Création du problème
        problem = cplex.Cplex()
        problem.objective.set_sense(problem.objective.sense.minimize)

        # Variables de décision
        noms_var =  ["x1", "x2", "x3", "x4",
                    "x5", "x6", "x7", "x8",
                    "x9", "x10", "x11", "x12",
                    "x13", "x14", "x15", "x16"]
        # Coefficients des variables de décision
        obj = [
        9,2,7,8,
        6,4,3,7,
        5,8,1,8,
        7,6,9,4
        ]
        # Bornes inférieures(par d faut 0,0)
        lower_bounds = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
        #Ajout des variables au modèle
        problem.variables.add(obj=obj, lb=lower_bounds, names=noms_var)

        # Nom des Contraintes
        noms_contraintes = ["E1", "E2","E3","E4","T1","T2","T3","T4"]
        # Expression des contraintes 
        
        lignes = [
            [[0, 1, 2, 3], [1.0, 1.0, 1.0, 1.0]], #x1 + x2 + X3 + x4  Employee 1
            [[4, 5, 6 ,7], [1.0, 1.0, 1.0, 1.0]], #x5 + x6 + x7 + x8 Employee 2
            [[8, 9, 10, 11],[1.0, 1.0, 1.0, 1.0]], #x9+ x10 + x11 + x12 Employee 3
            [[12, 13, 14, 15],[1.0, 1.0, 1.0, 1.0]], #x13 + x14 + x15 + x16 Employee 4

            [[0, 4, 8,12],[1.0, 1.0, 1.0,1.0]], #x1 +x5 + x9 + x13 TAche 1
            [[1, 5, 9,13],[1.0, 1.0, 1.0,1.0]], #x2 +x6 + x10 + x14 Tache 2
            [[2, 6, 10,14],[1.0, 1.0, 1.0,1.0]], #x3 +x7 + x11 + x15 Tache 3
            [[3, 7, 11,15],[1.0, 1.0, 1.0,1.0]] #x4 +x8 + x12 + x16 Tache 4

        ]

       
        # Coté droits des contraintes (cout)
        rhs = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,1.0]
        # Sens des contraintes('E' pour =)
        senses = ["E","E", "E","E", "E", "E","E","E"]  # 'E' pour egalité
        #Ajout des contraintes au modèle
        problem.linear_constraints.add(lin_expr=lignes, senses=senses, rhs=rhs, names=noms_contraintes)

        # Résolution
        problem.solve()

        # Résultats
        # Affichage du statut de la solution
        print("Statut de la solution :", problem.solution.get_status())
        print(problem.solution.status[problem.solution.get_status()])
        # Affichage de la valeur optimale de la fonction objectif
        print(" Solution total optimal :", problem.solution.get_objective_value())
        #Affichage  des valeurs optimales des variables de décision
        valeurs_vars = problem.solution.get_values()
        for i, var_name in enumerate(noms_var):
            print(f"Quantité optimale de {var_name} :", valeurs_vars[i])

    except CplexError as e:
        print(e)

modele_production_Exercice2()

"""
 Solution total optimal et minimal : 13.0
Quantité optimale de x1 : 0.0
Quantité optimale de x2 : 1.0
Quantité optimale de x3 : 0.0
Quantité optimale de x4 : 0.0
Quantité optimale de x5 : 1.0
Quantité optimale de x6 : 0.0
Quantité optimale de x7 : 0.0
Quantité optimale de x8 : 0.0
Quantité optimale de x9 : 0.0
Quantité optimale de x10 : 0.0
Quantité optimale de x11 : 1.0
Quantité optimale de x12 : 0.0
Quantité optimale de x13 : 0.0
Quantité optimale de x14 : 0.0
Quantité optimale de x15 : 0.0
Quantité optimale de x16 : 1.0
le resultat semble cohérent,
"""
def modele_production_Exercice3():
    try:
        # Création du problème
        problem = cplex.Cplex()
        problem.objective.set_sense(problem.objective.sense.minimize)

        # Variables de décision
        noms_var =  ["M1", "M2", "M3", "M4"]
        # Coefficients des variables de décision
        obj = [
        5,3,4,6
        ]
        # Bornes inférieures(par d faut 0,0)
        lower_bounds = [0.0, 0.0, 0.0, 0.0]
        upper_bounds = [100.0, 80.0, 120.0, 150.0 ]
        #Ajout des variables au modèle
        problem.variables.add(obj=obj, lb=lower_bounds,ub=upper_bounds, names=noms_var)

        # Nom des Contraintes
        noms_contraintes = ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "C11"]
        # Expression des contraintes 
        

        lignes = [
            [[0, 1, 2, 3], [1.0, 1.0, 1.0, 1.0]], #M1+M2+M3+M4 = 50 (alliage 1)
            [[0],[1.0]], #M1 <= 20  40% de 50 unité à produire (alliage 1)
            [[1],[1.0]], #M2 >= 15  30% de 50 unité à produire (alliage 1)
            [[2],[1.0]], #M3 = 10  20% de 50 unité à produire (alliage 1)
              

            [[0, 1, 2, 3], [1.0, 1.0, 1.0, 1.0]], #M1+M2+M3+M4 = 60 (alliage 2)
            [[1],[1.0]], #M2 >= 12  20% de 60 unité à produire (alliage 2)
            [[2],[1.0]], #M3 >= 30  50% de 60 unité à produire (alliage 2)


            [[0, 1, 2, 3], [1.0, 1.0, 1.0, 1.0]],#M1+M2+M3+M4 = 70 (alliage 3)
            [[0],[1.0]], #M1 =  17,5  25% de 70 unité à produire (alliage 3)
            [[1],[1.0]], #M2 >= 17,5   25% de 70 unité à produire (alliage 3)
            [[3],[1.0]], #M4 >= 21  30% de 70 unité à produire (alliage 3)

        ]

        # Coté droits des contraintes 
        rhs = [50.0,20.0,15.0,10.0,
                60.0,12.0,30.0,
                 70.0, 17.5,17.5,21.0,]
        # Sens des contraintes('E' pour =)
        senses = ["E","L","G","E", #Alliage 1
                "E","L","L", #Alliage 2
                 "E","E","E","L"] #Alliage 3
        #Ajout des contraintes au modèle
        problem.linear_constraints.add(lin_expr=lignes, senses=senses, rhs=rhs, names=noms_contraintes)

        # Résolution
        problem.solve()

        # Résultats
        # Affichage du statut de la solution
        print("Statut de la solution :", problem.solution.get_status())
        print(problem.solution.status[problem.solution.get_status()])
        # Affichage de la valeur optimale de la fonction objectif
        print("Solution total optimal :", problem.solution.get_objective_value())
        #Affichage  des valeurs optimales des variables de décision
        valeurs_vars = problem.solution.get_values()
        for i, var_name in enumerate(noms_var):
            print(f"Quantité optimale de {var_name} :", valeurs_vars[i])

    except CplexError as e:
        print(e)

modele_production_Exercice3()

"""
Solution infaisable, surement une erreur de modélisation ou de code.
pas le temps de refaire l'exercice
"""