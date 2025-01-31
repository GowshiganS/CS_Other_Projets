
from collections import deque
graph = {
	'A':['B','C'],
	'B':['C','D'],
	'C':['D'],
	'D':['C'],
	'E':['F'],
	'F':['C'],

}




def recursive_dfs(graph,node,visited=None):
	if visited==None:
		visited=[] # initialisation de la liste de noeuds non visités (vide au premier appel)
	if node not in visited: # on ajoute le noeud actuel comme etant visité
		visited.append(node)

	graphe_pas_visited=[] # liste de sommets pas encore visités
	for noeud in graph[node]: # parcours les sommets suivants du noeud actuel
		if noeud not in visited:# si ils ont pas été visité
			graphe_pas_visited.append(noeud) # on les ajoute à la liste de non visité 
	for node in graphe_pas_visited: 
		recursive_dfs(graph,node,visited)# on fait un appel recursif pour faire le parcours des noeuds non visités
	return visited # liste de sommets visiés en DFS

print(recursive_dfs(graph,"E"))

def iterative_bfs(graph,start):
	visited=[] # sommets visités
	parcours = [] # notre parcours qu'on retourne
	queue= deque()  # initalisation de la file
	queue.append(start) # on met le départ dans la file
	while queue:
		temp=queue.popleft() # premier sommet de la file
		if temp not in visited: # si le sommet n'est pas encore visité
			parcours.append(temp) #ajoute au parcours
			visited.append(temp) # on le considéere visité
			for noeud_suivant in graph[temp]: # on parcours les sommets suivants du noeud
				if noeud_suivant not in visited:
					queue.append(noeud_suivant) #on ajoute les sommets pas encore visité à la fin
	return parcours # on retourne le parcours BFS final

#fonction test
print(iterative_bfs(graph,"A"))

def find_paths_bfs(graph,start,end):
	if start == end:
		return[start] # si le noeud de depart et la fin sont les memes

	visited=[] # noeuds visités
	chemin=[] # chemin qu'on cherche
	queue = deque([[start]]) # intialisation du file à start

	while queue:
		chemin=queue.popleft() # chemin récupere premier noeud dans la file
		noeud = chemin[-1] # le dernier noeud du chemin actuel

		if noeud == end:
			return chemin #chemin trouvé
		#exploration des noeuds adjacent non visités
		for noeuds in graph[noeud]:
			if noeuds not in visited:
				visited.append(noeuds) #on met a jour les noeuds visités
				chemin = chemin+ [noeuds] # mis à jour du chemin
				queue.append(chemin) #on ajoute à la file le nouveau chemin
	return None # pas de chemin entre start et end

#fonctions test
print(find_paths_bfs(graph,'A','D'))
print(find_paths_bfs(graph,'A','E'))
print(find_paths_bfs(graph,'D','D'))

