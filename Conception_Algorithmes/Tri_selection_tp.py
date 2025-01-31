import time
import matplotlib.pyplot as plt # pour afficher le temps

def randlist(n,a=100,b=1000):
	from random import randrange
	return[randrange(a,b) for _ in range(n)]

result = randlist(10)


times=[] # tableau où on stocke les temps d'exécutions

def tri_selection(L):
	start_time=time.time()

	n=len(L)
	for i in range(n-1,0,-1):
		Min= L[0]
		for j in range(1,i+1):
			if L[j]> Min:
				L[j-1]=L[j]
			else:
				L[j-1]=Min 
				Min=L[j]
		L[i]=Min

	return (time.time()-start_time)


taille_tableaux = [10,100,1000,10000]
for i in taille_tableaux:
	tableau=randlist(i)
	#print("Tableau pas trié:",tableau)
	temps=tri_selection(tableau)
	print(temps)
	#print("Tableau trié:",tableau)
	times.append(temps)

plt.plot(taille_tableaux,times,marker='o')
plt.ylabel('temps en secondes')
plt.xlabel('taille')
plt.title("Temps d'exécution d'un Tri par selection")
plt.show()



