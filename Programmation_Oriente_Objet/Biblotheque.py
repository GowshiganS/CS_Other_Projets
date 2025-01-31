#Classe parente
class Ouvrage:
	def __init__(self,titre,auteur,annee,disponible=True):
		self.titre=titre
		self.auteur=auteur
		self.annee=annee
		self.disponible=disponible

#permet en cas d'emprunt si l'ouvrage est disponible et le met a jour 
	def emprunter(self):
		if self.disponible==True:
			self.disponible=False # on le met indisponible car emprunté
			return True
		else: return False #si pas disponible

#permet retourner en cas de retour si l'ouvrage est emprunté
	def retourner(self):
		if self.disponible==False:
			self.disponible=True # on le remet disponible
			return True
		else: return False #si retour a echoué

#affichage de details de l'oeuvre
	def afficher_details(self):
		print(f'titre: ',self.titre,'auteur: ',self.auteur,'annee: ',self.annee,'disponibilité: ',self.disponible)

#Classe livre qui hérite de l'ouvrage
class Livre(Ouvrage):
	def __init__(self,isbn,editeur,nombre_pages,titre,auteur,annee,disponible):
		self.isbn=isbn
		self.editeur=editeur
		self.nombre_pages=nombre_pages
		Ouvrage.__init__(self,titre,auteur,annee,disponible)

#affiche les détails du livre + ouvrage
	def afficher_details(self):
		super().afficher_details()
		print(f'ISBN: ',self.isbn,'Editeur: ',self.editeur,'Nombre_pages: ',self.nombre_pages,'\n')
#permet de changer d'éditeur
	def changer_editeur(self,nouvel_editeur):
		self.editeur=nouvel_editeur
#permet d'augmenter le nombre de page
	def augmenter_pages(self,nombre):
		self.nombre_pages =+ nombre

#classe magazine qui hérite de ouvrage
class Magazine(Ouvrage):
	def __init__(self,numero,frequence_parution,titre,auteur,annee,disponible):
		self.numero=numero
		self.frequence_parution=frequence_parution
		Ouvrage.__init__(self,titre,auteur,annee,disponible)

#affiche les details
	def afficher_details(self):
		super().afficher_details()
		print(f'numero: ',self.numero,'frequence_parution: ',self.frequence_parution,'\n')

#changer la fréquence de parution
	def change_frequence(self,nouvelle_frequence):
		self.frequence_parution=nouvelle_frequence

#permet de incrementer num de serie du magazine
	def ajouter_numero(self):
		self.numero=+1

#Classe Cd qui hérite de ouvrage
class CD(Ouvrage):
	def __init__(self,duree,artiste,titre,auteur,annee,disponible,chanson=None):
		self.duree=duree
		self.artiste=artiste
		if chanson is None:
			self.chanson=[]
		else:
			self.chanson=list(chanson)

		Ouvrage.__init__(self,titre,auteur,annee,disponible)

#affiche les details
	def afficher_details(self):
		super().afficher_details()
		print(f'duree: ',self.duree,'artiste: ',self.artiste,'\n')

#permet de changer l'artiste
	def changer_artiste(self,nouvel_artiste):
		self.artiste = nouvel_artiste
#permet d'ajouter une nouvelle chanson au cd
	def ajouter_chanson(self,chanson):
		self.chanson.append(chanson)
#classe livreaudio qui hérite de livre et par extension ouvrage
class LivreAudio(Livre):
	def __init__(self,duree_audio,auteur_audio,isbn,editeur,nombre_pages,titre,auteur,annee,disponible):
		self.duree_audio=duree_audio
		self.auteur_audio=auteur_audio
		self.chapitre=[]
		Livre.__init__(self,isbn,editeur,nombre_pages,titre,auteur,annee,disponible)
#affiche les détails
	def afficher_details(self):
		super().afficher_details()
		print(f'durée_audio: ',self.duree_audio,'auteur_audio: ',self.auteur_audio,'\n')

#permet de changer d'auteur du livre audio
	def changer_auteur_audio(self,nouvel_auteur):
		self.auteur_audio=nouvel_auteur
#permet de ajouter une  nouvelle chapitre au livre audio
	def ajouter_chapitre(self,chapitre):
		self.chapitre.append(chapitre)

#définiton de la classe bibliothéque

class Bibliotheque():
	def __init__(self):
		self.ouvrage=[]
#ajout ouvrage
	def ajouter_ouvrage(self,ouvrage):
		self.ouvrage.append(ouvrage)
#retirer ouvrage
	def retirer_ouvrage(self,ouvrage):
		self.ouvrage.remove(ouvrage)
#affiche les ouvrages disponibles dans la bibliothèque
	def liste_ouvrages_disponibles(self):
		for ouvrage in self.ouvrage:
			if ouvrage.disponible==True:
				print(ouvrage.titre) # verifier
#permet de rechercher un ouvrage par son nom, retourne none si il est pas présent dans la biblothéque
	def rechercher_ouvrage(self,titre):
		for ouvrage in self.ouvrage:
			if ouvrage.titre == titre:
				return ouvrage 
		return None

# emprunte l'oeuvre si il est disponible dans la biblothèque et disponible à l'emprunt , retourne True si c'est le cas , False sinon
	def emprunter_ouvrage(self,titre):
		ouvrage=self.rechercher_ouvrage(titre)
		if ouvrage:
			if ouvrage.emprunter():
				print(f"'{titre}' emprunté")
				return True
			else: 
				print(f"'{titre}' n'a pas pu être emprunté")
				return False
		else:
			print(f"'{titre}' pas disponible dans la Bibliotheque")
			return False
#permet de retourner un ouvrage emprunté dans la Bibilothèque, retourne True si reussi, False sinon
	def retourner_ouvrage(self,titre):
		ouvrage=self.rechercher_ouvrage(titre)
		if ouvrage:
			if ouvrage.retourner():
				print(f"'{titre}' retourné")
				return True
			else: 
				print(f"'{titre}' n'a pas pu être retourné")
				return False
		else:
			print(f"'{titre}' n'appartient pas à la Bibliotheque")
			return False


#Création de quelque exemples d'ouvrages
Candide=Livre('2F4R22','Gabriel Cramer','223','Candide','auteur','1759',True)

Shonen_Jump=Magazine('1','hebdomadaire','Shonen Jump','Shûeisha','11 Juillet 1968',True)

Discovery=CD('60.14','Daft Punk','Discovery','Daft Punk','2001',True,None)

Les_deux_tours=LivreAudio('18h','Thierry Janssen','2F5R24','Christian Bourgois','259','Les Deux Tours','J.R.R Tolkien','2018',True)

#Création de la Biblothèque
Alexandrie=Bibliotheque()
#Ajout d'ouvrages pour tester D)
Alexandrie.ajouter_ouvrage(Candide)
Alexandrie.ajouter_ouvrage(Shonen_Jump)
Alexandrie.ajouter_ouvrage(Discovery)
#Question E)
Alexandrie.liste_ouvrages_disponibles()
#Question F)
Alexandrie.emprunter_ouvrage('Candide')
Alexandrie.emprunter_ouvrage('Python pour les nuls')
#Question G)
Alexandrie.retourner_ouvrage('Candide')
Alexandrie.retourner_ouvrage('Hacking pour les nuls')
#Question H)
Alexandrie.ajouter_ouvrage(Les_deux_tours)
print(f"La durée de l'audio:",Alexandrie.rechercher_ouvrage(Les_deux_tours.titre).duree_audio,'\n')
#Question I)
Alexandrie.rechercher_ouvrage('Shonen Jump').afficher_details()
#Question J)
Alexandrie.rechercher_ouvrage('Discovery').titre = 'Random Access Memories'
Alexandrie.rechercher_ouvrage('Random Access Memories').afficher_details()