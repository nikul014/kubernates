provider "google" {
  credentials = file("tribal-cortex-428712-n1-362bed283611.json")
  project = "tribal-cortex-428712-n1"
  region  = "us-central1"
}

resource "google_container_cluster" "primary" {
  name               = "gke-cluster"
  location           = "us-central1-a"
  initial_node_count = 1

  node_config {
    machine_type = "e2-micro"
    disk_size_gb = 10
    disk_type    = "pd-standard"
    image_type   = "COS_CONTAINERD"
  }

  master_auth {
    client_certificate_config {
      issue_client_certificate = false
    }
  }
}