import cplex
from cplex.exceptions import CplexError

def modele_production():
    try:
        # Création du problème
        problem = cplex.Cplex()
        problem.objective.set_sense(problem.objective.sense.maximize)

        # Variables de décision
        noms_var = ["x1", "x2"]
        # Coefficients de la fonction objectif
        obj = [20.0, 30.0]
        # Bornes inférieures(par d faut 0,0)
        lower_bounds = [0.0, 0.0]
        #Ajout des variables au mod le
        problem.variables.add(obj=obj, lb=lower_bounds, names=noms_var)

        # Nom des Contraintes
        noms_contraintes = ["Atelier_A", "Atelier_B"]
        # Expression des contraintes 
        lignes = [
            [[0, 1], [2.0, 1.0]],
            [[0, 1], [1.0, 2.0]]
        ]
        # Coté droits des contraintes
        rhs = [100.0, 80.0]
        # Sens des contraintes('L' pour <=)
        senses = ["L", "L"]  # 'L' means less than or equal
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

if __name__ == "__main__":
    modele_production()
