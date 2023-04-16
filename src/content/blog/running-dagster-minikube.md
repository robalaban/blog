---
title: Setting up Dagster on Minikube with Terraform
slug: running-dagster-minikube
external: false
excerpt: Quick walkthrough on getting up and running with Dagster locally on a Kubernetes cluster with Terraform
date: 2022-02-24
tags:
    - kubernetes
    - tutorials
---

[Dagster](https://dagster.io/) is a data orchestration platform similar to [Airflow](https://airflow.apache.org/) and [Prefect](https://www.prefect.io/) I won't go into the difference or similarity amongst the tools, but after using both Airflow and Dagster, I happen to realy like Dagsters API and easy of use. Especially when it comes to the deployment.

The following tutorial is a step by step guide on getting started with Dagster on Kubernetes specifically minikube.

### Environment

In order to keep things simple, a local cluster with minikube is going to be the environment of choice. Minikube [has a comprehensive guide](https://minikube.sigs.k8s.io/docs/start/) on getting started on all platforms, but for this tutorial I will be focusing on OSX.

```shell
brew install minikube
```

Start our local kubernetes cluster:

```shell
minikube start
```

Starting a local minikube cluster will automatically create an entry in: `~/.kube/config` ( this will be useful in a little while, so remember that path )

### Terraform

Great, now that we have a Kubernetes cluster running on our machine, next up is "hooking" terraform to it, so that we can manage resources with it. Lets do that:

Create the following structure in any folder you want, to keep things simple, I just named the folder: `dagster-orchestration`

```shell
└── dagster-orchestration
    ├── chart.tf
    ├── main.tf
    ├── opt
    │   └── values.yaml
    └── providers.tf
```

Alright, now that we got the structre out of the way and all the folders time to take a look at what is inside.

#### Providers.tf

Usually, I like to keep in here information about the different providers I am going to use, in our case kubernetes and helm:

```hcl
terraform {
	required_providers {
		kubernetes = {
			source = "hashicorp/kubernetes"
			version = ">= 2.0.0"
		}
	}
}

provider "kubernetes" {
	config_path = "~/.kube/config"
	config_context = "minikube"
}

provider "helm" {
	kubernetes {
		config_path = "~/.kube/config"
		config_context = "minikube"
	}
}
```

Everything above should look fairl standard except maybe `config_context` in the helm provider and the kubernetes provider, this is used to to specify which kuberntes in our config file we will be targeting, useful if you have multiple kubernetse configs ( production / staging / local ).

Alright, now that we have the `provider.tf` all set up, we can quickly run: `terraform init` to initialize terraforms state backend and download any providers we will be using.

#### Chart.tf

I have a convention to name the file `chart.tf` if the resource is using a helm chart, in our case, to keep things simple we're using the official helm chart from dagster. More information can be found here [on their official website](https://docs.dagster.io/deployment/guides/kubernetes/deploying-with-helm)

```hcl
resource "helm_release" "dagster" {
	name = "dagster"
	repository = "https://dagster-io.github.io/helm"
	chart = "dagster"

	values = [
		"${file("/opt/values.yaml")}"
	]
}
```

The value array holds the `values.yaml` file, this file is used to store configuration about the helm chart we will be deploying, a full and up-to-date file can be found on [dagsters github](https://github.com/dagster-io/dagster/edit/master/helm/dagster/values.yaml).

There is a very small change we're going to make, in `values.yaml` we need to add a tag to the example user code:

```yaml
deployments:
  - name: "k8s-example-user-code-1"
    image:
	# When a tag is not supplied, it will default as the Helm chart version.
	repository: "docker.io/dagster/user-code-example"
	tag: ~ <- change to latest
```

Now that the chart is in place and to test that everything is working, we can keep the default values for now in `values.yaml` and run `terraform apply`. This is goint to create the resources defined in the helm chart, on our kubernetes cluster, pretty neat no?

It should take about _4ish_ minutes to complete, but if that is done with success we can run `minikube dashbaord` this will open a browser, here we can see our pods happily running.

### Accessing Dagster

Although we do not have an ingress set-up we can quickly access dagster UI running the following.

```shell
minikube service dagster-dagit --url
```

🙌 Great job you have sucessfully deployed Dagster on Kubernetes!
