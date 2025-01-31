class Livre():
	def __init__(self, titre,auteur,isbn):
		self.titre= titre
		self.auteur=auteur
		self.isbn=isbn
		self.disponible=True

	def _get_titre(self):
		return self.titre

	def emprunter(self):
		self.disponible=False

	def retourner(self):
		self.disponible=True

	def est_disponible(self):
		if(self.disponible==True):
			return True
		else: False

class Bibliotheque():
	def __init__(self):
		self.livres=[]

	def ajouter_livre(self,livre):
		self.livres.append(livre)

	def retirer_livre(self,livre):
		self.livres.remove(livre)

	def rechercher_livre(self,titre):
		if titre in self.livres :
			return titre.titre
		else: return None

	def listes_livres_disponibles(self):
		for livre in self.livres:
			print(livre._get_titre())

	def emprunter_livre(self,titre):
		for titre in self.livres:
			if titre.est_disponible():
				titre.emprunter
				print("le livre a ",titre.titre," été emprunté")
			else: print(titre.titre +" n'est pas disponible")

	def retourner_livre(self,titre):
		if self.livres(titre).retourner(titre):
			return(" le livre "+titre.titre+"a été retourné")
		else: print(titre.titre +" n'a pas pu être retourné")


## Commandes tests

#Candide=Livre("Candide","Voltaire",1)
#Les_Fables=Livre("Les Fables de la Fontaine","Jean de La Fontaine",2)
#Bibliotheque_Universitaire= Bibliotheque()
#Bibliotheque_Universitaire.ajouter_livre(Candide)
#Bibliotheque_Universitaire.ajouter_livre(Les_Fables)

#print(Bibliotheque_Universitaire.listes_livres_disponibles())
#Bibliotheque_Universitaire.retirer_livre(Candide)
#print(Bibliotheque_Universitaire.rechercher_livre(Les_Fables))
#print(Bibliotheque_Universitaire.rechercher_livre(Candide))

#Bibliotheque_Universitaire.emprunter_livre("Les Fables de la Fontaine")
#Bibliotheque_Universitaire.retourner_livre("Les Fables de la Fontaine")