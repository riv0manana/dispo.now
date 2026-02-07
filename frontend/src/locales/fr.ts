export const fr = {
  translation: {
    seo: {
      title: "dispo.now | L'Infrastructure de Réservation Auto-Hébergée",
      description: "Arrêtez de payer la taxe SaaS. L'infrastructure de réservation open-source, conforme ACID pour les développeurs. Possédez vos données, évoluez sans limite et éliminez les conditions de concurrence.",
    },
    nav: {
      docs: "Docs",
      github: "GitHub",
      login: "Connexion"
    },
    hero: {
      badge: "Open Source & Auto-Hébergé",
      title: {
        part1: "Votre Infra de",
        part2: "Réservation."
      },
      subtitle: {
        line1: "Perdez pas de temps.",
        line2: "Commencez à livrer votre produit."
      },
      description: "Nous gérons la logique complexe de disponibilité, de capacité et de concurrence afin que vous puissiez vous concentrer sur votre expérience utilisateur.",
      cta: {
        readDocs: "Lire la documentation",
        getApiKey: "Obtenir une clé API"
      }
    },
    workflow: {
      title: "dispo.now gère la disponibilité et la réservation.",
      subtitle: "Vous gérez le produit, les paiements, et l’expérience.",
      nodes: {
        app: "Votre App",
        booking: "Planificateur",
        payment: "Paiements",
        auth: "Auth",
        db: "Base de Données"
      }
    },
    faq: {
      title: "Questions Fréquemment Posées",
      items: [
        {
          id: "what-is-dispo-now",
          question: "Qu'est-ce que dispo.now ?",
          answer: "dispo.now est une infrastructure de disponibilité et de réservation open-source. Elle gère le temps, la capacité et la cohérence des réservations pour que vous puissiez vous concentrer sur votre produit, les paiements et l'expérience utilisateur."
        },
        {
          id: "what-problems-does-it-solve",
          question: "Quels problèmes résout dispo.now ?",
          answer: "Il résout les parties les plus difficiles des systèmes de réservation : calcul de disponibilité, prévention des conflits, concurrence et cohérence des réservations à travers des scénarios complexes comme la location, les ressources partagées et les réservations basées sur le temps."
        },
        {
          id: "what-dispo-now-does-not-do",
          question: "Qu'est-ce que dispo.now ne fait intentionnellement PAS ?",
          answer: "dispo.now ne gère pas l'authentification, les paiements, la logique de tarification, les e-mails ou les flux de travail spécifiques à l'entreprise. Ces préoccupations sont laissées à votre application par conception."
        },
        {
          id: "who-is-it-for",
          question: "Pour qui est dispo.now ?",
          answer: "dispo.now est conçu pour les développeurs et les équipes construisant des produits personnalisés nécessitant des réservations, tels que des locations, des marketplaces, des plateformes de planification ou des outils internes."
        },
        {
          id: "is-it-a-saas",
          question: "Est-ce que dispo.now est un SaaS ?",
          answer: "Non. dispo.now est auto-hébergé et open-source. Vous l'exécutez sur votre propre infrastructure, sans frais par réservation, sans limites d'utilisation et sans verrouillage fournisseur."
        },
        {
          id: "how-does-it-compare-to-calendly",
          question: "En quoi dispo.now est différent de Calendly ou d'outils similaires ?",
          answer: "Les outils de style Calendly sont des produits finaux avec des flux de travail arrêtés. dispo.now est une infrastructure. Il fournit des primitives de réservation et des API pour que vous puissiez construire vos propres flux de travail, interface utilisateur et logique."
        },
        {
          id: "how-does-it-compare-to-cal-com",
          question: "En quoi dispo.now est différent de Cal.com ?",
          answer: "Cal.com se concentre sur la planification de réunions. dispo.now se concentre sur la disponibilité et les réservations en tant que composant système, prenant en charge les locations, les réservations basées sur la capacité, les ressources partagées et les règles métier personnalisées."
        },
        {
          id: "can-i-use-it-with-stripe",
          question: "Puis-je utiliser dispo.now avec Stripe ?",
          answer: "Oui. dispo.now est couramment utilisé avec Stripe pour les paiements. dispo.now gère la disponibilité et les réservations, tandis que Stripe gère la tarification, les paiements et la facturation."
        },
        {
          id: "can-i-use-my-own-auth",
          question: "Puis-je utiliser mon propre système d'authentification ?",
          answer: "Oui. dispo.now est agnostique en matière d'authentification. Vous pouvez utiliser Clerk, Auth0, des JWT personnalisés ou tout système d'authentification qui convient à votre architecture."
        },
        {
          id: "how-do-i-store-business-data",
          question: "Où dois-je stocker mes données métier et de domaine ?",
          answer: "Vos données métier restent dans votre propre base de données. dispo.now ne stocke que ce qui est nécessaire pour gérer la disponibilité et les réservations."
        },
        {
          id: "does-it-support-multiple-projects",
          question: "dispo.now prend-il en charge plusieurs projets ou locataires ?",
          answer: "Oui. dispo.now prend en charge l'isolation des projets, vous permettant de gérer plusieurs produits, environnements ou locataires à partir d'une seule instance."
        },
        {
          id: "is-it-production-ready",
          question: "dispo.now est-il prêt pour la production ?",
          answer: "Oui. dispo.now est conçu pour être déterministe, cohérent et sûr sous une utilisation concurrente, ce qui le rend adapté aux charges de travail de production."
        },
        {
          id: "can-i-extend-booking-types",
          question: "Puis-je créer des types de réservation personnalisés ?",
          answer: "Oui. dispo.now fournit des primitives flexibles qui vous permettent de modéliser différents types de réservation tels que des chambres, des véhicules, des articles, des créneaux horaires ou des scénarios hybrides."
        },
        {
          id: "how-does-it-scale",
          question: "Comment dispo.now évolue-t-il ?",
          answer: "dispo.now évolue horizontalement et peut être déployé à l'aide de Docker dans des environnements cloud modernes. Vous contrôlez les performances, la mise à l'échelle et les choix d'infrastructure."
        },
        {
          id: "why-open-source",
          question: "Pourquoi dispo.now est-il open-source ?",
          answer: "Parce que la logique de disponibilité et de réservation est une infrastructure de base. L'open-source garantit la transparence, l'extensibilité et le contrôle à long terme pour les équipes construisant des produits sérieux."
        }
      ]
    },
    features: {
      header: {
        title: "Conçu pour les équipes qui construisent des produits, pas des pages de réservation.",
        subtitle: "Arrêtez de réinventer la logique de planification. dispo.now fournit les primitives dont vous avez besoin pour construire des flux de réservation complexes sans prise de tête."
      },
      cards: {
        resource: {
          title: "Agnostique aux Ressources",
          subtitle: "Flexible par design, strict par nature.",
          tagline: "Ne combattez pas le framework.",
          description: "Réservez des salles, des équipements, des médecins ou des créneaux de serveur. Notre modèle de domaine est assez abstrait pour gérer toute entité réservable, mais assez strict pour garantir la validité.",
          tags: ["Modèle Universel", "Métadonnées Personnalisées", "Tout Actif"]
        },
        capacity: {
          title: "Capacité Sécurisée",
          subtitle: "Cohérence Garantie.",
          tagline: "Dormez sur vos deux oreilles.",
          description: "Conformité ACID stricte avec la sérialisation Postgres. Nous gérons les conditions de concurrence, les stratégies de verrouillage et l'isolation des transactions pour que vous n'ayez jamais de doubles réservations.",
          tags: ["ACID", "Postgres", "Pas de Surréservation"]
        },
        dx: {
          title: "DX First",
          subtitle: "Intégration en quelques minutes.",
          tagline: "Parce que votre temps compte.",
          description: "SDK TypeScript entièrement typés, documentation OpenAPI complète et un tableau de bord développeur qui respecte votre flux de travail. L'intégration prend des minutes, pas des semaines.",
          tags: ["TypeScript", "OpenAPI", "Webhooks"]
        }
      },
      cta: "Lire la documentation d'architecture"
    },
    useCases: {
      header: {
        title: "Conçu pour tous les scénarios de réservation",
        subtitle: "Des transactions atomiques à l'isolation multi-locataire, dispo.now s'adapte à votre modèle de domaine."
      },
      tabs: {
        car: {
          label: "Location de Voiture",
          description: "Réservation individuelle avec une capacité stricte de 1 unité. Idéal pour les flottes, les locations et l'équipement."
        },
        health: {
          label: "Santé",
          description: "Réservations de groupe atomiques. Réservez un médecin et une salle simultanément. Si l'un échoue, les deux échouent."
        },
        course: {
          label: "Cours Numérique",
          description: "Ressources à haute capacité. Gérez des webinaires, des événements ou des cours avec suivi automatique des places."
        },
        saas: {
          label: "Plateforme SaaS",
          description: "Architecture multi-locataire. Isolez les données clients à l'aide de projets. Une API, une infinité de locataires."
        },
        recurring: {
          label: "Réservation Récurrente",
          description: "Créez une série de réservations en une seule requête atomique. Parfait pour les réunions hebdomadaires ou les abonnements mensuels."
        },
        availability: {
          label: "Vérification de Disponibilité",
          description: "Interrogez la disponibilité pour une plage spécifique. Parfait pour construire des calendriers et des interfaces de planification."
        }
      },
      visuals: {
        available: "Créneaux Disponibles",
        left: "restants",
        booked: "Réservé",
        atomic: "TRANSACTION ATOMIQUE",
        capacity: "Capacité du Webinaire",
        isolation: "Isolation Stricte",
        recurring: "Chaque Mercredi"
      }
    },
    mcp: {
      badge: "Protocole Natif IA",
      title: {
        part1: "Prêt pour le",
        part2: "Futur Agentique"
      },
      description: "dispo.now n'est pas seulement une API pour les humains. Nous implémentons le <1>Model Context Protocol (MCP)</1>, permettant aux agents IA (comme Claude, Cursor ou des LLM personnalisés) de découvrir des ressources et d'effectuer des réservations de manière autonome.",
      points: [
        "Découverte d'Outils Standardisée",
        "Injection de Contexte Directe",
        "Flux de Réservation Zéro Hallucination"
      ],
      status: "MCP Connecté"
    },
    comparison: {
      badge: "INFRASTRUCTURE VS SAAS",
      title: "Arrêtez de payer la \"Taxe SaaS\".",
      description: "Pourquoi louer une API quand vous pouvez posséder l'infrastructure ? dispo.now vous donne le contrôle de la construction en interne avec la vitesse d'un service géré.",
      problem: "Le Problème",
      solution: "La Solution",
      ready: "Prêt à déployer via Docker",
      items: {
        sovereignty: {
          title: "Souveraineté des Données",
          saas: {
            title: "API SaaS (Timekit, Hapio)",
            desc: "Vos données clients vivent dans leur cloud.",
            points: ["Maux de tête RGPD/HIPAA", "Fuites de données possibles", "Verrouillage fournisseur"]
          },
          dispo: {
            desc: "S'exécute dans votre VPC. Vous possédez tout.",
            points: ["Propriété des données à 100%", "Zéro fuite tierce partie", "Journalisation d'audit"]
          }
        },
        cost: {
          title: "Coût & Échelle",
          saas: {
            title: "API SaaS",
            desc: "Payez par requête. Succès = Pénalité.",
            points: ["Cher à l'échelle", "Limites d'utilisation", "Factures imprévisibles"]
          },
          dispo: {
            desc: "Gratuit & Open Source (AGPLv3).",
            points: ["Réservations illimitées", "Coût d'infrastructure fixe", "Pas de 'Taxe au Succès'"]
          }
        },
        correctness: {
          title: "Exactitude",
          saas: {
            title: "Construction en Interne",
            desc: "Les conditions de concurrence sont inévitables.",
            points: ["Doubles réservations", "État corrompu", "Cauchemar de maintenance"]
          },
          dispo: {
            desc: "Moteur de Transaction ACID.",
            points: ["Rigueur Postgres", "Réservations de Groupe Atomiques", "Impossible de surréserver"]
          }
        }
      }
    },
    company: {
      title: "Prêt pour la <1>Production</1> ?",
      description: "dispo.now est open source, mais nous proposons une Licence Commerciale pour les entreprises qui ont besoin de plus.",
      features: [
        "Support Prioritaire & SLA",
        "Journaux d'Audit & SSO",
        "Événements Webhook & Alertes",
        "Développement de Fonctionnalités Personnalisées"
      ],
      enterprise: {
        title: "Édition Entreprise",
        subtitle: "Auto-hébergé avec tout inclus",
        license: "Licence",
        commercial: "Commerciale",
        support: "Support",
        dedicated: "Dédié 24/7",
        deployment: "Déploiement",
        custom: "VPC Personnalisé / Sur Site"
      }
    },
    dashboard: {
      resources: "Ressources",
      addResource: "Ajouter Ressource",
      bookingConfirmed: "Réservation Confirmée",
      liveLogs: "Journaux en Direct",
      created: "Créé",
      checkingAvailability: "Vérification de la disponibilité..."
    },
    footer: {
      tagline: "Le moteur de réservation headless pour les développeurs modernes.",
      copyright: "Copyright © {{year}}.",
      product: {
        title: "Produit",
        docs: "Documentation",
        api: "Référence API"
      },
      company: {
        title: "Entreprise",
        website: "riv0manana.dev",
        github: "GitHub"
      }
    }
  }
};
